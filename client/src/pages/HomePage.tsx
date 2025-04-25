

import ChatContainer from "../components/ChatContainer"
import GrpChatContainer from "../components/GrpChatContainer"
import NoChatSelected from "../components/NoChatSelected"
import SideBar from "../components/SideBar"
import useChatStore from "../store/useChatStore"
import useGrpChatStore from "../store/useGrpChatStore"


const HomePage = () => {


const {selectedUser} = useChatStore()
const {selectedGroup} = useGrpChatStore()


  return (
    <div className="h-screen bg-base-200">
      <div className="flex items-center justify-center pt-20 px-4">
        <div className="bg-base-100 rounded-lg shadow-cl w-full max-w-6xl h-[calc(100vh-8rem)]">
          <div className="flex h-full rounded-lg overflow-hidden">
            <SideBar />

           {selectedUser ?  <ChatContainer /> :selectedGroup ? <GrpChatContainer />: <NoChatSelected />}

          </div>
        </div>
      </div>
    </div>

  )
}

export default HomePage