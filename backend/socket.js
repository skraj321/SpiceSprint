import User from "./models/User.js";
export const socketHandler = (io)=>{
    io.on('connection',(socket)=>{
        socket.on('identity',async(userId)=>{
            try{
                const user=await User.findByIdAndUpdate(userId,{
                    socketId: socket.id,
                    isOnline: true
                },{new: true});
            }catch(err){
                console.error("Error occurred while handling identity:", err);
            }
        })
        socket.on("updateLocation", async ({ latitude, longitude, userId }) => {
            try{
                const user=await User.findByIdAndUpdate(userId,{
                    location:{
                        type: "Point",
                        coordinates: [longitude, latitude]
                    },
                    isOnline: true,
                    socketId: socket.id
                },{new: true
                })
                if(user){
                  io.emit("updateDeliveryLocation",{
                    delBoyId: userId,
                    latitude,
                    longitude
                  })
                }
            }catch(err){
                console.error("Error occurred while updating location:", err);
            }
        })
        socket.on('disconnect',async()=>{
            try{
                const user=await User.findOneAndUpdate({socketId: socket.id},{
                    socketId: null,
                    isOnline: false
                },{new: true});
            }catch(err){
                console.error("Error occurred while handling disconnect:", err);
            }
        })
    })
}