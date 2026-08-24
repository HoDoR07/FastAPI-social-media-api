from fastapi import FastAPI, Response, status, HTTPException, Depends,APIRouter
from .. import models, schemas,oauth2
from typing import List,Optional
from sqlalchemy import func
from sqlalchemy.orm import Session
from ..database import get_db


router = APIRouter(prefix="/posts",
                   tags=['Posts'])


## psycopg2


# @router.get("/",response_model=List[schemas.PostRes])
# def get_posts():
#     cursor.execute(""" SELECT * FROM posts """)
#     posts = cursor.fetchall()
#     return {"data": posts}


# @app.post("/", status_code=status.HTTP_201_CREATED,response_model=schemas.PostRes)
# def createpost(post: schemas.CreatePost, current_user :int = Depends(oauth2.get_current_user)):
#     cursor.execute(""" INSERT INTO posts (title, content, published) VALUES (%s, %s, %s) RETURNING *""",
#                    (post.title, post.content, post.published))
#     new_post = cursor.fetchone()

#     conn.commit()
#     return {"data": new_post}

# # @router.get("/latest")
# # def get_latest_posts(current_user:int = Depends(oauth2.get_current_user)):
# #     post = my_posts[len(my_posts)-1]
# #     return {"detail": post}


# @router.get("/{id}",response_model=schemas.PostRes)
# def get_post(id: int,current_user:int = Depends(oauth2.get_current_user)):
#     cursor.execute("""SELECT * FROM posts WHERE id = %s""",(id,))
#     post = cursor.fetchone()
#     if not post:
#         raise HTTPException(status_code=status.HTTP_404_NOT_FOUND,
#                             detail=f"Post not found at id: {id}")
#     return {"Data": post}


# # This is Hard code

# # @router.get("/{id}",response_model=schemas.PostRes)
# # def get_post(id: int, response: Response,current_user:int = Depends(oauth2.get_current_user)):
# #     post = find_post(id)
# #     if post is None:
# #         response.status_code = status.HTTP_404_NOT_FOUND
# #         return{"messege": f"Post not found at id: {id}"}
# #     return {"Data": post}


# # delete Post

# @router.delete("/{id}", status_code=status.HTTP_204_NO_CONTENT)
# def delete_posts(id: int,current_user:int = Depends(oauth2.get_current_user)):
#     cursor.execute("""DELETE FROM posts WHERE id = %s RETURNING *""",(id,))
#     index = cursor.fetchone()
#     if index == None:
#         raise HTTPException(status_code=status.HTTP_404_NOT_FOUND,
#                             detail=f"Post with id: {id} doseNot Exist")
#     conn.commit()
#     return Response(status_code=status.HTTP_204_NO_CONTENT)


# @router.put("/{id}",response_model=schemas.PostRes)
# def update_post(id: int, post: schemas.CreatePost,current_user:int = Depends(oauth2.get_current_user)):
#     cursor.execute("""UPDATE posts SET title = %s, content = %s, published = %s WHERE id = %s RETURNING *""",
#                    (post.title,post.content,post.published,id))
#     updated_post = cursor.fetchone()

#     if updated_post == None:
#         raise HTTPException(status_code=status.HTTP_404_NOT_FOUND,
#                             detail=f"Post with id: {id} doseNot Exist")
#     conn.commit()
#     return {"message": updated_post}







#### SQL_ALCHEMY


# @router.get("/",response_model=List[schemas.PostRes])
@router.get("/",response_model=List[schemas.PostOut])
def get_posts(db: Session = Depends(get_db),
              current_user:int = Depends(oauth2.get_current_user),
                Limit: int = 10,skip: int = 0,search: Optional[str]=""):

    #if we want to see Posts of only the Signed User
    # posts = db.query(models.Post).filter(models.Post.owner_id==current_user.id).all()

    #if we want all posts
    # posts = db.query(models.Post).filter(
    #     models.Post.title.contains(search)).limit(Limit).offset(skip).all()

    # return  posts
    
    posts =  db.query(models.Post,func.count(models.Vote.post_id).label("Vote")).join(
        models.Vote, models.Vote.post_id == models.Post.id, isouter=True).group_by(
            models.Post.id).filter(
        models.Post.title.contains(search)).limit(Limit).offset(skip).all()

    return [
    {
        "Post": post,
        "votes": votes
    }
    for post, votes in posts
]

@router.post("/", status_code=status.HTTP_201_CREATED,response_model=schemas.PostRes)
def create_post(post: schemas.CreatePost, db: Session = Depends(get_db),
                current_user:int = Depends(oauth2.get_current_user)):
    # new_post = models.Post(title=post.title, content = post.content, published = post.published) # insted of this
    
    print(current_user.email)
    new_post = models.Post(owner_id = current_user.id,**post.dict())
    db.add(new_post)
    db.commit()
    db.refresh(new_post)
    return  new_post

# @router.get("/{id}",response_model=schemas.PostRes)

@router.get("/{id}",response_model=schemas.PostOut)
def get_post(id: int, db: Session = Depends(get_db),
             current_user: int = Depends(oauth2.get_current_user)):

    # post = db.query(models.Post).filter(models.Post.id==id).first()

    result = db.query(models.Post, func.count(models.Vote.post_id).label("Vote")).join(
        models.Vote, models.Vote.post_id == models.Post.id, isouter=True).group_by(
            models.Post.id).filter(models.Post.id == id).first()

    if not result:
        raise HTTPException(status_code=status.HTTP_404_NOT_FOUND,
                            detail=f"Post not found at id: {id}")

    post, votes = result

    if post.owner_id != current_user.id:
        raise HTTPException(status_code=status.HTTP_403_FORBIDDEN,
                            detail=f"Not Authorized to perform requested action")

    # return post

    return {
        "Post": post,
        "votes": votes
    }

@router.delete("/{id}", status_code=status.HTTP_204_NO_CONTENT)
def delete_posts(
    id: int,
    db: Session = Depends(get_db),
    current_user: int = Depends(oauth2.get_current_user)
):

    # Find post
    post = db.query(models.Post).filter(
        models.Post.id == id
    ).first()

    # Post doesn't exist
    if post is None:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail=f"Post with id: {id} does not exist"
        )

    # Only post owner can delete
    if post.owner_id != current_user.id:
        raise HTTPException(
            status_code=status.HTTP_403_FORBIDDEN,
            detail="Not Authorized to perform requested action"
        )

    # Delete votes related to this post first
    db.query(models.Vote).filter(
        models.Vote.post_id == id
    ).delete(
        synchronize_session=False
    )

    # Delete post
    db.delete(post)

    db.commit()

    return Response(
        status_code=status.HTTP_204_NO_CONTENT
    )

@router.put("/{id}",response_model=schemas.PostRes)
def update_post(id: int, post: schemas.CreatePost, db: Session = Depends(get_db),current_user:int = Depends(oauth2.get_current_user)):

    post_query = db.query(models.Post).filter(models.Post.id == id)

    db_post = post_query.first()

    if db_post is None:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail=f"Post with id: {id} does not exist"
        )   
    if db_post.owner_id != current_user.id:
        raise HTTPException(status_code=status.HTTP_403_FORBIDDEN,
                            detail=f"Not Authorized to perform requested action")
     
    post_query.update(post.dict(), synchronize_session=False)

    db.commit()

    return post_query.first()