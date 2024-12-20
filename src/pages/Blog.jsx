import React, { useContext, useEffect, useState } from 'react';
import { RightSide } from '../components/RightSide';
import { Link, useNavigate, useParams } from 'react-router-dom';
import axios from 'axios';
import Swal from 'sweetalert2';
import moment from 'moment';
import { AuthContext } from '../Context/authContext';
import { SideBar } from '../components/SideBar';
import { Recommended } from '../components/Recommended';
import { FaEye } from 'react-icons/fa6';
import { FaHeart, FaRegHeart } from 'react-icons/fa6';

export const Blog = () => {
  const [blog, setBlog] = useState({});
  const [liked, setLiked] = useState(false); // Track whether the blog is liked
  const [loading, setLoading] = useState(true); // State to manage loading
  const { user } = useContext(AuthContext);
  const { id } = useParams('id');
  const navigate = useNavigate();

  // Fetch the blog data
  useEffect(() => {
    const fetchBlog = async () => {
      try {
        const res = await axios.get(`/blogs/${id}`);
        setBlog(res.data.blog);
        setLoading(false);
  
        const storedLikedState = localStorage.getItem(`blog-${id}-liked`);
        if (storedLikedState !== null) {
          setLiked(JSON.parse(storedLikedState)); // Use the stored value
        }
  
      } catch (error) {
        console.log(error);
        setLoading(false);
      }
    };
    fetchBlog();
  }, [id, user]);
  



  const handleDelete = async () => {
    function getCookie(name) {
      const cookieString = document.cookie;
      const cookies = cookieString.split(';');

      for (let i = 0; i < cookies.length; i++) {
        const cookie = cookies[i].trim();
        if (cookie.startsWith(name + '=')) {
          return cookie.substring(name.length + 1);
        }
      }

      return null;
    }

    const token = getCookie('token');
    const accessToken = {
      token: token,
    };

    console.log(accessToken);

    await Swal.fire({
      title: 'Are you sure?',
      text: "You won't be able to revert this!",
      icon: 'warning',
      showCancelButton: true,
      confirmButtonColor: '#3085d6',
      cancelButtonColor: '#000',
      confirmButtonText: 'Yes, delete it!',
    }).then((result) => {
      if (result.isConfirmed) {
        axios
          .delete(`/blogs/${id}/delete`, {
            headers: {
              token,
            },
          })
          .then((res) => {
            Swal.fire({
              title: 'Deleted!',
              text: 'Your blog has been deleted.',
              icon: 'success',
            });
            navigate('/');
          })
          .catch((error) => {
            console.log(error);
          });
      }
    });
  };

  const handleLike = async () => {
    try {
        // Like the blog
        await axios.post(`/blogs/${id}/like`, null, {
          headers: {
            token: document.cookie.split('=')[1], // Get the token from cookies
          },
        });

        // Toggle the like state
        setLiked((prevLiked) => {
          const newLikedState = !prevLiked;
          // Store the new liked state in localStorage
          localStorage.setItem(`blog-${id}-liked`, newLikedState);
          return newLikedState;
        });

      setBlog((prevBlog) => ({
        ...prevBlog,
        likes_count: liked ? prevBlog.likes_count - 1 : prevBlog.likes_count + 1, // Update like count
      }));
    } catch (error) {
      console.log(error);
    }
  };

  return (
    <div className="font-serif flex space-x-10">
      <div className="space-y-4 lg:w-[50rem] md:w-[30rem] flex-grow rounded-b bg-light">
        {loading ? (
          <div className="flex gap-2 font-serif fixed justify-center items-center lg:w-[50rem] lg:h-[40rem] md:w-[30rem] md:h-[15rem]">
            <svg
              aria-hidden="true"
              className="w-8 h-8 text-gray-200 animate-spin dark:text-gray-200 fill-black"
              viewBox="0 0 100 101"
              fill="none"
              xmlns="http://www.w3.org/2000/svg"
            >
              <path
                d="M100 50.5908C100 78.2051 77.6142 100.591 50 100.591C22.3858 100.591 0 78.2051 0 50.5908C0 22.9766 22.3858 0.59082 50 0.59082C77.6142 0.59082 100 22.9766 100 50.5908ZM9.08144 50.5908C9.08144 73.1895 27.4013 91.5094 50 91.5094C72.5987 91.5094 90.9186 73.1895 90.9186 50.5908C90.9186 27.9921 72.5987 9.67226 50 9.67226C27.4013 9.67226 9.08144 27.9921 9.08144 50.5908Z"
                fill="currentColor"
              />
              <path
                d="M93.9676 39.0409C96.393 38.4038 97.8624 35.9116 97.0079 33.5539C95.2932 28.8227 92.871 24.3692 89.8167 20.348C85.8452 15.1192 80.8826 10.7238 75.2124 7.41289C69.5422 4.10194 63.2754 1.94025 56.7698 1.05124C51.7666 0.367541 46.6976 0.446843 41.7345 1.27873C39.2613 1.69328 37.813 4.19778 38.4501 6.62326C39.0873 9.04874 41.5694 10.4717 44.0505 10.1071C47.8511 9.54855 51.7191 9.52689 55.5402 10.0491C60.8642 10.7766 65.9928 12.5457 70.6331 15.2552C75.2735 17.9648 79.3347 21.5619 82.5849 25.841C84.9175 28.9121 86.7997 32.2913 88.1811 35.8758C89.083 38.2158 91.5421 39.6781 93.9676 39.0409Z"
                fill="currentFill"
              />
            </svg>
            Loading...
          </div>
        ) : (
          <>
            <div>
              <img
                src={blog.image}
                alt=""
                className="rounded w-full object-cover max-h-[25rem]"
              />
            </div>
            <div className="px-10 pb-10">
              <div className="flex items-center justify-between">
                <Link to={`/users/${blog.user_id}`} className="flex items-center space-x-2">
                  <div className="w-12 h-12">
                    {blog.user?.avatar ? (
                      <img
                        src={blog.user?.avatar}
                        className="flex items-center justify-center text-2xl object-cover border h-full w-full rounded-2xl"
                      />
                    ) : (
                      <div className="flex items-center justify-center bg-black text-tertiary text-2xl object-cover border h-full w-full rounded-2xl">
                        {blog.user?.username.charAt(0)}
                      </div>
                    )}
                  </div>
                  <div className="flex flex-col">
                    <span>{blog.user?.username}</span>
                    <span className="text-sm">Posted {moment(blog.created_at).fromNow()}</span>
                  </div>
                </Link>
                {blog.user_id === user?.id ? (
                  <div className="flex space-x-4">
                    <Link to={`/blogs/${id}/edit`}>📝edit</Link>
                    <button onClick={handleDelete}>❌delete</button>
                  </div>
                ) : (
                  ''
                )}
              </div>

              <div className="mt-10 space-y-5">
                <div>
                  <h1 className="text-4xl font-bold">{blog.title}</h1>
                  <div className="flex items-center gap-5">
                    <p className="text-slate-400 text-xs md:text-sm">#{blog.category?.name}</p>
                    <span className="text-sm flex items-center gap-1 text-gray-400">
                      <FaEye />
                      {blog.views}
                    </span>
                  </div>
                </div>
                <p
                  className="leading-8 text-xl"
                  dangerouslySetInnerHTML={{ __html: blog.content }}
                >
                  {/* content goes here */}
                </p>
              </div>
              <hr className="mt-4" />
              <div className="flex items-center mt-4">
                <button onClick={handleLike} className={`${liked && ' bg-red-100 border-white'} flex items-center justify-center gap-2 border p-2 rounded-full text-gray-500 px-4 hover:bg-gray-100 min-w-[5rem]`}>
                  {liked ? <FaHeart className=" text-red-500" /> : <FaRegHeart />}
                  <span>{blog.likes_count}</span>
                </button>
              </div>
            </div>
          </>
        )}
      </div>
      <div className="">
        <Recommended currentBlog={blog} />
      </div>
    </div>
  );
};
