import Fastify from "fastify"
const app=Fastify();
app.get("/",async()=>{
    return {message:"worker API is Running"}
});
app.listen({
    port:4000,
})