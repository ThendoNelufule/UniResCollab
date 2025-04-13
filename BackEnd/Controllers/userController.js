const  collection  = require('../Models/userModel');
const bcrypt=require('bcrypt');

module.exports = {
    welcome:(req,res)=>{
        res.render('index.ejs');
    },
    register:(req,res)=>{
        res.render('Register.ejs');
    },
    AdminHome: async (req, res) => {
        const freshUser = await collection.findById(req.user._id);
        res.render('AdminHome.ejs', { user: freshUser });
    },
    ResearcherHome: async (req, res) => {
        const freshUser = await collection.findById(req.user._id);
        res.render('ResearcherHome.ejs', { user: freshUser });
    },
    ReviewerHome: async (req, res) => {
        const freshUser = await collection.findById(req.user._id);
        res.render('ReviewerHome.ejs', { user: freshUser });
    },
    login: (req, res) => {
        res.render('login',{error:null});
    },
      
    //   //I am going to need these function in the future
    //   loginFill: async (req, res) => {
    //     let { username, password } = req.body;
    
    //     if (username === "" || password === "" ) {
    //         return res.render('login',{error:"Username or Password is Empty"});
    //     }
    
    //     try {
            
    //         const data = await collection.find({ username });
    
    //         if (data.length === 0) {
    //             return res.render('login',{error:"Username not found"});
    //         }
    
           
    //         const hashedPassword = data[0].password;
    //         const userRole = data[0].role; 
          
        
            
    //         const result = await bcrypt.compare(password, hashedPassword);
    
    //         if (result) {
               
    //             if (userRole==="") {
    //                 return res.render('login',{error:"The role id empty"});
    //             }
    
                
    //             if (userRole === "Researcher") {
    //                 return res.render('ResearcherHome');
    //             } else if (userRole === "Admin") {
    //                 return res.render('AdminHome');
    //             } else if (userRole === "Reviewer") {
    //                 return res.render('ReviewerHome');
    //             } else {
    //                 return res.render('login',{error:"The role you entered is incorrect"});
    //             }
    //         } else {
    //             return res.render('login',{error:"Incorrect password"});
    //         }
    //     } catch (err) {
    //         console.error(err);
    //         return res.render('login',{error:"An error occured"});
    //     }
    // }
    
    // ,
    // registerFill: async (req, res) => {
    //     try {
    //       let { username, email, password, role } = req.body;
    //       username = username.trim();
    //       email = email.trim();
    //       password = password.trim();
    //       role = role.trim();
    //       const UserRole = role;
      
    //       const salt = 5;
    //       const hashedPassword = await bcrypt.hash(password, salt);
      
    //       const newUser = new collection({
    //         username,
    //         email,
    //         password: hashedPassword,
    //         role:UserRole
    //       });
      
    //       await newUser.save();
    //       res.send("Added");
    //     } catch (err) {
    //       console.error(err);
    //       res.send("Failed");
    //     }
    //   }
        
  }

  