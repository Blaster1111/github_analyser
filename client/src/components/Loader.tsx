import { quantum } from 'ldrs'

quantum.register()

export const Loader = () => {
    return (
        <div className="flex justify-center items-center min-h-screen">
            {/* @ts-ignore */}
            <l-quantum size="45" speed="1.75" color="purple"></l-quantum>
        </div>
    )
}