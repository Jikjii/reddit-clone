import { useSession } from 'next-auth/react'
import React, { useState } from 'react'
import Avatar from './Avatar'
import { LinkIcon, PhotographIcon } from '@heroicons/react/outline'
import { useForm } from 'react-hook-form'
import { useMutation } from '@apollo/client'
import { ADD_POST, ADD_SUBREDDIT } from '../graphql/mutations'
import client from '../apollo-client'
import { GET_SUBREDDIT_BY_TOPIC } from '../graphql/queries'
import toast from 'react-hot-toast'

type FormData = {
    postTitle: string
    postBody: string
    postImage: string
    subreddit: string
}


const PostBox = () => {
    const { data: session } = useSession()
    const [addPost] = useMutation(ADD_POST)
    const [addSubreddit] = useMutation(ADD_SUBREDDIT)

    const [imageBoxOpen, setImageBoxOpen] = useState<boolean>(false)

    const { register, setValue, handleSubmit, watch, formState: { errors}, } = useForm<FormData>() 

    const onSubmit = handleSubmit(async (formData) => {
        console.log(formData)
        console.log('this is were it stops')
        const notification = toast.loading('Creating new post...')

        try {
            // Query for the subreddit topic
            console.log('error occurs here')
            const {data: { getSubredditListByTopic }, } = await client.query({
                query: GET_SUBREDDIT_BY_TOPIC,
                variables: {
                    topic: formData.subreddit,
                },
            })

            
            
            // this variable will be true if subreddit topic exist
            const subredditExists = getSubredditListByTopic.length > 0
            
            if (!subredditExists) {
                // create subreddit
                console.log('Subreddit is new -> creating a NEW subreddit')
                
                // th data being pulled from the addedSubreddit is being named insertSubreddit
                // then it is being futher destructred into a new name -> newSubreddit
                // the name was insertSubreddit bc thats the name in graphql file
                const { data: { insertSubreddit: newSubreddit } } = await addSubreddit({
                    variables: {
                        topic: formData.subreddit
                }
                })

                console.log('creating post... ', formData)

                const image = formData.postImage || ''
                // if you are creating a new post for a subreddit that did not exist
                // a new subreddit will be created 
                const {data: { insertPost: newPost }, } = await addPost({
                    variables: {
                        body: formData.postBody,
                        image: image,
                        subreddit_id: newSubreddit.id,
                        title: formData.postTitle,
                        username: session?.user?.name,

                    },
                })

                console.log('new post added', newPost)
            } else {
                // use existing subreddit
                console.log('using existing subreddit')
                console.log(getSubredditListByTopic)
                // refactor this
                const image = formData.postImage || ''

                const {data: {insertPost: newPost}} = await addPost({
                    variables: {
                    body: formData.postBody,
                    image: image,
                    subreddit_id: getSubredditListByTopic[0].id,
                    title: formData.postTitle,
                    username: session?.user?.name,
                    }
                })

                console.log('new post was added', newPost)
            }

            // After the post has been added 
            // this clears the value held in these states
            setValue('postBody', '')
            setValue('postImage', '')
            setValue('postTitle', '')
            setValue('subreddit', '')

            toast.success('New Post Created', {
                id: notification,
            })

        } catch (error) {
            console.log('error here')
            console.log(error)
            toast.error('Something went wrong', {
                id: notification,
            })
        }
    })

  return (
    <form onSubmit={onSubmit} className="sticky top-16 z-50 bg-white border rounded-md border-gray-300 p-2">
        <div className="flex items-center space-x-3">
            <Avatar seed="geraldo" />

            <input
                {...register('postTitle', { required: true })}
                disabled={!session} className="rounded-md flex-1 bg-gray-50 p-2 pl-5 outline-none" 
                type="text" 
                placeholder={session ?  "Create a Post by entering a title" : "Sign in to post"} 
            />
            <PhotographIcon
                onClick={() => setImageBoxOpen(!imageBoxOpen)}
                className={`h-6 text-gray-300 cursor-pointer ${imageBoxOpen && 'text-blue-300'}`} 
            />
            <LinkIcon 
                className="h-6 text-gray-300" 
            />

        </div>

        {!!watch('postTitle') && (
            <div className="flex flex-col py-2">
                {/* body */}
                <div className="flex items-center px-2">
                    <p className="min-w-[90px]">Body:</p>
                    <input  className="m-2 flex-1 bg-blue-50 p-2 outline-none" {...register('postBody')} type="text" placeholder="Text (optional)" />
                </div>


                <div className="flex items-center px-2">
                    <p className="min-w-[90px]">Subreddit:</p>
                    <input  className="m-2 flex-1 bg-blue-50 p-2 outline-none" {...register('subreddit', { required: true })} type="text" placeholder="i.e Programming" />
                </div>



                    {imageBoxOpen && (
                        <div className="flex items-center px-2">
                            <p className="min-w-[90px]">Image URL:</p>
                            <input  className="m-2 flex-1 bg-blue-50 p-2 outline-none" {...register('postImage')} type="text" placeholder="URL (optional)" />
                        </div>
                    )}

                    {/* errors */}
                    {Object.keys(errors).length > 0 && (
                        <div className="space-y-2 p-2 text-red-500">
                            {errors.postTitle?.type === 'required' && (
                                <p>- A Post Title is required</p>
                            )}
                            {errors.subreddit?.type === 'required' && (
                                <p>- A Subreddit is required</p>
                            )}
                        </div>
                    )}
                    {!!watch('postTitle') && <button type="submit" className="w-full rounded-full bg-blue-400 p-2 text-white">Create Post</button>}
                </div>
        )}

    </form>
  )
}

export default PostBox