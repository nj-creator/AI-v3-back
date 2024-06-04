const ResponseInterceptor = require("../interceptors/response.interceptor");
const { Frame } = require("../models/frame.model");
const { Project } = require("../models/project.model");
const { Scene } = require("../models/scene.model");

class checkTrial{
    static async countCreation(userId){
        var data={project:0,frame:0,scene:0};
        const projects=await Project.find({user:userId});
        if (projects.length===0) {
            return data;
        }else{
            data.project=projects.length;
            const projectIds=projects.map((item)=>item._id);
            const scenes=await Scene.find({project:projectIds});
            if (scenes.length===0) {
                return data;
            }else{
                data.scene=scenes.length;
                const sceneIds=scenes.map((item)=>item._id);
                const frames=await Frame.find({scene:sceneIds});
                if (frames.length===0) {
                    return data;
                }else{
                    data.frame=frames.length;
                    return data;
                }
            }
        }
    }
    static async checkTrialComplete(req,res){
        const response=new ResponseInterceptor(res);
        const { userId } = req.user;
        const {type}=req.body;
        try {
            const data =await checkTrial.countCreation(userId);
            if (data[type]) {
                if (type==="project"&&(data[type]+1)<=1) {
                    return response.ok({isTrialComplete:false})
                }else if (type==="scene"&&(data[type]+1)<=5) {
                    return response.ok({isTrialComplete:false})
                }else if (type==="frame"&&(data[type]+1)<=40) {
                    return response.ok({isTrialComplete:false})
                }else{
                    return response.ok({isTrialComplete:true})
                }
            }else{
                return response.badRequest("enter valid type");
            }
        } catch (error) {
            console.log(error,"error in checkTrial");
            return response.internalServerError();
        }

    }
}

module.exports = { checkTrial };