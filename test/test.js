var connect = require("../dbConnect.js");
connect(require("../settings").DEV_DB_URI);
var Userfades = require("../facades/userfades");
var expect = require('chai').expect;

describe('testUserfacade', function () {
        var findalluser = {}

        it('Find all User in db', async function(){
        findalluser = await Userfades.getAllUsers();        
        var findlength = findalluser.users.length;
        expect(findlength).to.be.equal(4);
        });
        it('find one person', async function(){
             var user = await Userfades.findByUserName("a");
           
             expect(user.users.firstName).to.be.equal("a");   
        });
        it('findonebyid', async function(){
                var user = await Userfades.findById(findalluser.users[0]._id);
                expect(user.users.firstName).to.be.equal("a");   
           });

});



