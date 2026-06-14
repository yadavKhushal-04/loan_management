//will be used when API call are in process

const Loader = () => {
    return (
        <div className="flex items-center justify-center h-full w-full py-20">
            <div className="w-10 h-10 border-4 border-blue-500 border-t-transparent rounded-full animate-spin" />
        </div>
    )
}

export default Loader