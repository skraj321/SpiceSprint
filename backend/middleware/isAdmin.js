export const isAdmin = async(req,res,next) => {
    try{
        if(!req.user){
            return res.status(401).json({error: "Unauthorized"});
        }
        if(req.user.role !== "admin"){
            return res.status(403).json({error: "Forbidden: Admins only"});
        }
        next();
    } catch (error) {
        return res.status(500).json({error: "Internal Server Error"});
    }
}
