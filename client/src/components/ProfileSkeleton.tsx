const ProfileSkeleton = () => {
    return (
      <div className="h-full py-20 animate-pulse">
        <div className="max-w-2xl mx-auto p-4 py-8">
          <div className="bg-base-300 rounded-xl p-6 space-y-8">
            <div className="text-center">
              <div className="h-6 w-24 mx-auto bg-zinc-700 rounded" />
            </div>
  
            {/* avatar skeleton */}
            <div className="flex flex-col items-center gap-4">
              <div className="relative">
                <div className="size-32 rounded-full bg-zinc-700 border-4" />
              </div>
            </div>
  
            <div className="space-y-6">
              {/* Full Name */}
              <div className="space-y-1.5">
                <div className="flex items-center gap-2">
                  <div className="w-4 h-4 bg-zinc-700 rounded" />
                  <div className="h-4 w-20 bg-zinc-700 rounded" />
                </div>
                <div className="px-4 py-3 bg-base-200 rounded-lg border h-6 w-full" />
              </div>
  
              {/* Email */}
              <div className="space-y-1.5">
                <div className="flex items-center gap-2">
                  <div className="w-4 h-4 bg-zinc-700 rounded" />
                  <div className="h-4 w-28 bg-zinc-700 rounded" />
                </div>
                <div className="px-4 py-3 bg-base-200 rounded-lg border h-6 w-full" />
              </div>
            </div>
  
            <div className="mt-6 bg-base-300 rounded-xl p-6">
              <div className="h-5 w-40 bg-zinc-700 mb-4 rounded" />
              <div className="space-y-3 text-sm">
                <div className="flex items-center justify-between py-2 border-b border-zinc-700">
                  <div className="h-4 w-24 bg-zinc-700 rounded" />
                  <div className="h-4 w-20 bg-zinc-700 rounded" />
                </div>
                <div className="flex items-center justify-between py-2">
                  <div className="h-4 w-24 bg-zinc-700 rounded" />
                  <div className="h-4 w-16 bg-zinc-700 rounded" />
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  };
  export default ProfileSkeleton;