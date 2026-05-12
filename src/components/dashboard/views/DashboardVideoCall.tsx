// @ts-nocheck
import { useState } from 'react'
import { motion } from 'framer-motion'
import { useNavigate, useParams } from 'react-router'
import { Video, ArrowLeft, Mic, MicOff, Camera, CameraOff, PhoneOff, MonitorUp, MessageSquare, Users } from 'lucide-react'

export default function DashboardVideoCall() {
  const navigate = useNavigate()
  const { roomId } = useParams()
  const [micOn, setMicOn] = useState(true)
  const [camOn, setCamOn] = useState(true)

  return (
    <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ duration: 0.5 }} className="h-[calc(100vh-80px)] flex flex-col">
      <div className="flex items-center justify-between mb-4">
        <div className="flex items-center gap-3">
          <button onClick={() => navigate('/dashboard/video-rooms')} className="flex items-center gap-2 text-gray hover:text-sage-dark">
            <ArrowLeft size={18} />
          </button>
          <div className="w-10 h-10 rounded-xl flex items-center justify-center bg-sage/10">
            <Video size={20} className="text-sage" />
          </div>
          <div>
            <h1 className="heading-4 text-dark">Video Call</h1>
            <p className="text-caption text-gray">Room: {roomId || 'New Room'}</p>
          </div>
        </div>
      </div>

      <div className="flex-1 rounded-2xl bg-dark/90 flex items-center justify-center mb-4">
        <div className="text-center">
          <div className="w-20 h-20 rounded-full bg-sage/10 flex items-center justify-center mx-auto mb-4">
            <Users size={32} className="text-sage" />
          </div>
          <p className="text-white/60 text-sm">Waiting for others to join...</p>
        </div>
      </div>

      <div className="flex items-center justify-center gap-4 py-4">
        <button onClick={() => setMicOn(!micOn)} className={`w-12 h-12 rounded-full flex items-center justify-center transition-all ${micOn ? 'bg-sage/10 text-sage' : 'bg-coral/10 text-coral'}`}>
          {micOn ? <Mic size={20} /> : <MicOff size={20} />}
        </button>
        <button onClick={() => setCamOn(!camOn)} className={`w-12 h-12 rounded-full flex items-center justify-center transition-all ${camOn ? 'bg-sage/10 text-sage' : 'bg-coral/10 text-coral'}`}>
          {camOn ? <Camera size={20} /> : <CameraOff size={20} />}
        </button>
        <button className="w-12 h-12 rounded-full flex items-center justify-center bg-gray/10 text-gray hover:bg-gray/20">
          <MonitorUp size={20} />
        </button>
        <button className="w-12 h-12 rounded-full flex items-center justify-center bg-gray/10 text-gray hover:bg-gray/20">
          <MessageSquare size={20} />
        </button>
        <button onClick={() => navigate('/dashboard/video-rooms')} className="w-12 h-12 rounded-full flex items-center justify-center bg-coral text-white hover:bg-coral/90">
          <PhoneOff size={20} />
        </button>
      </div>
    </motion.div>
  )
}
