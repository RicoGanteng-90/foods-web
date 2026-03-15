export default function Login() {
  return (
    <div className="min-h-screen bg-gray-800 flex justify-center items-center">
      <div className="bg-gray-400 w-125 h-125 rounded-3xl py-14">
        <div className="items-center flex flex-col">
          <p className="text-3xl text-gray-900 font-serif font-semibold">
            Login
          </p>
        </div>
        <div className="flex flex-col mt-14 mx-8 gap-4">
          <div className="flex flex-col gap-1">
            <div className="">Email</div>
            <input className="border rounded-2xl py-3" />
          </div>
          <div className="flex flex-col gap-1">
            <div className="">Password</div>
            <input className="border rounded-2xl py-3" />
          </div>
        </div>
        <div className="flex justify-end mx-8 mt-10">
          <button className="bg-gray-600 px-10 py-3 rounded-3xl hover:bg-gray-700 cursor-pointer active:bg-gray-800 focus:outline-2 focus:outline-offset-2">
            Login
          </button>
        </div>
      </div>
    </div>
  );
}
