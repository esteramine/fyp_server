const mongoose = require('mongoose');

const { MONGODB } = require('./config');

const PORT = process.env.PORT || 4000;

mongoose
    .connect(MONGODB, { useNewUrlParser: true,  useUnifiedTopology: true })
    .then(()=> {
        console.log('MongoDB Connected!');
        return server.listen({ port: PORT });
    })
    .then(res=>{
        console.log(`Server listening at ${res.url}`);
    })
    .catch(err => {
       console.error(err); 
});