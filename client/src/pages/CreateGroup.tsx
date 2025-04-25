import { Camera, DeleteIcon, GroupIcon, Loader2, UserPlusIcon } from "lucide-react"
import useChatStore from "../store/useChatStore"
import { useEffect, useState } from "react"
import { useAuthStore } from "../store/useAuthStore"
import toast from "react-hot-toast"
import useGrpChatStore from "../store/useGrpChatStore"
import { useNavigate } from "react-router-dom"


const CreateGroup = () => {

    const {users, getUsers} = useChatStore()
    const {authUser} = useAuthStore()
    const [preview, setPreview] = useState<string | null>(null)
    const [name, setName] = useState<string>("")
    const [members, setMembers] = useState<string[]>([]);
    const [picture, setPicture] = useState<File | null>(null)


    useEffect(()=>{
        getUsers()
    },[getUsers])

    const formData = new FormData()

    const handleImageUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0]
        if(file){
            setPicture(file)
            setPreview(URL.createObjectURL(file))
        }
    }

    const persons = users.filter((user) => members.includes(user._id))
    

    const notAddedPersons = users.filter((user) => !members.includes(user._id))
    

    const handleMembers = (id: string) => {
        if(members.includes(id)){
            setMembers((prev) => prev.filter((member) => member !== id))
        }else {
            setMembers((prev) => [...prev, id])
        }
    }

    const {createGroup, isGrpCreating} = useGrpChatStore()
    const navigate = useNavigate()

    const handleCreate = async () =>{
        if(!name) return toast.error("Please enter a group name")
        if(members.length < 2) return toast.error("Please add at least 2 members")
            if(members.length > 12) return toast.error("You can only add up to 12 members")
            formData.append("picture", picture as File)
        formData.append("name", name)
        formData.append("members", JSON.stringify(members))
        console.log("formData", formData)
        if(!authUser){
            return toast.error("Please login to create a group")
        }
       const res = await createGroup(authUser?._id, formData)
       if(res){
            navigate('/')
       }
    }

  return (
    <div className="h-screen bg-base-200">
        <div className="flex items-center justify-center pt-20 px-4">
        <div className="bg-base-100 rounded-lg shadow-cl w-full max-w-6xl h-[calc(100vh-8rem)]">
          <div className="flex h-full rounded-lg overflow-hidden">
            
          <aside className="h-full w-20 lg:w-72 border-r border-base-300 flex flex-col transition-all duration-200">
    <div className="border-b border-base-300 w-full p-5">
      <div className="flex items-center gap-2">
        <UserPlusIcon className="size-6" />
        <span className="font-medium hidden lg:block">Add to Group</span>
      </div>
    </div>

   

    <div className="overflow-y-auto w-full py-3">
      {notAddedPersons?.map((user) => (
        <button
          key={user._id}
          className={`
            w-full p-3 flex items-center gap-3
            hover:bg-base-300 transition-colors
          `}
          onClick={() => handleMembers(user._id)}
        >
          <div className="relative mx-auto lg:mx-0">
            <img
              src={user?.profilePicture || "https://cdn-icons-png.flaticon.com/512/149/149071.png"}
              alt={user?.username}
              className="size-12 object-cover rounded-full"
            />
          
          </div>

          {/* GroupIcon info - only visible on larger screens */}
          <div className="hidden lg:block text-left min-w-0">
            <div className="font-medium truncate">{user?.username}</div>

          </div>
        </button>
      ))}

      
    </div>
  </aside>


  <div className="flex-1 flex flex-col overflow-auto">
      

      <div className="flex-1 overflow-y-auto p-4 space-y-4">
      <div className="h-full">
    <div className="max-w-2xl mx-auto p-4 py-8">
      <div className="bg-base-300 rounded-xl p-6 space-y-8">
        <div className="text-center">
          <h1 className="text-2xl font-semibold ">Craete Your Group</h1>
          <p className="mt-2">Craete group and murmur with friends.</p>
        </div>

        {/* avatar upload section */}

        <div className="flex flex-col items-center gap-4">
          <div className="relative">
            <img
              src={preview ||"https://cdn-icons-png.flaticon.com/512/149/149071.png"}
              alt="Profile"
              className="size-32 rounded-full object-cover border-4 "
              onError={(e) => {
                e.currentTarget.onerror = null; // Prevent looping
                e.currentTarget.src = "https://cdn-icons-png.flaticon.com/512/149/149071.png";
              }}
            />
            <label
              htmlFor="avatar-upload"
              className={`
                absolute bottom-0 right-0 
                bg-base-content hover:scale-105
                p-2 rounded-full cursor-pointer 
                transition-all duration-200
                
              `}
            >
              <Camera className="w-5 h-5 text-base-200" />
              <input
                type="file"
                id="avatar-upload"
                className="hidden"
                accept="image/*"
                onChange={handleImageUpload}
                
              />
            </label>
          </div>
        
        </div>

        <div className="space-y-6">
          <div className="space-y-1.5">
            <div className="text-sm text-zinc-400 flex items-center gap-2">
              <GroupIcon className="w-4 h-4" />
              Group Name
            </div>
            <input className="px-4 py-2.5 bg-base-200 rounded-lg border w-full" placeholder="Group name" value={name} onChange={(e) => setName(e.target.value)} />
          </div>

          <div className="mt-6 bg-base-300 rounded-xl p-6">
          {persons?.map((user) => (
        <div
          key={user._id}
          className={`
            w-full p-3 flex items-center gap-3
            hover:bg-base-300 transition-colors
          `}
          onClick={() => handleMembers(user._id)}
        >
          <div className="relative mx-auto lg:mx-0">
            <img
              src={user?.profilePicture || "https://cdn-icons-png.flaticon.com/512/149/149071.png"}
              alt={user?.username}
              className="size-12 object-cover rounded-full"
            />
          
          </div>

          {/* GroupIcon info - only visible on larger screens */}
          <div className="hidden lg:block text-left min-w-0">
            <div className="font-medium truncate">{user?.username}</div>

          </div>
<div className="flex-1 flex justify-end">
    <button onClick={()=>handleMembers(user._id)} className="btn btn-ghost btn-sm">
    <DeleteIcon />
    </button>
</div>

        </div>
      ))}
        </div>

          <div className="space-y-1.5">
          <button onClick={handleCreate} className="btn btn-primary w-full" 
          disabled={isGrpCreating}
          >
              {isGrpCreating ? (
                <>
                  <Loader2 className="h-5 w-5 animate-spin" />
                  Loading...
                </>
              ) : ( 
                "Create Group"
              )}
            </button>
            
          </div>
        </div>

     
      </div>
    </div>
  </div>



      </div>

     
    </div>

          
          </div>
        </div>
      </div>
    </div>
  )
}

export default CreateGroup