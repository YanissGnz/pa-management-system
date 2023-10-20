import { LoaderIcon } from "lucide-react"

export default function loading() {
  return (
    <div className='flex h-screen flex-1 items-center justify-center'>
      <LoaderIcon className='animate-spin text-gray-600' size={48} />
    </div>
  )
}
