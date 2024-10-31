
const { expect } = require('chai')
const sinon = require('sinon');

describe('user-service', () => {
    let userService;
    let dbStub;
    let emailServiceStub;
    let sandbox;

    before(() => {
        console.log('start...!');
    });

    after(() => {
        console.log('finish...!');
    });

    beforeEach(() => {
        
    });

    afterEach(() => {

    })

    // 1. spies
    describe('Spies - tracking function calls', () => {
        it('should call welcome method when user is created', async () => {
            userService = new UserService({});
            const emailSpy = sinon.spy(userService, 'welcome');

            userService.welcome({ email: 'foo@bar.com' });
            expect(emailSpy.called).to.be.true;
            expect(emailSpy.withArgs({ email: 'foo@bar.com' })).to.be.true;
            expect(emailSpy.calledOnce).to.be.true;
            emailSpy.restore();
        });
    });

    // 2. stubs
    describe('Stubs - pre-defined behavior', () => {
        it('should throw an error when user already exists', async () => {
            dbStub = {
                checkUserExists: sinon.stub().returns(true),
                createUser: sinon.stub()
            };

            userService = new UserService(dbStub);

            try {
                await userService.createUser({ username: 'foo' });
            } catch (error) {
                expect(error.message).to.equal('User already exists');
            }
        });
    });

    // 3. mocks
    describe('Mocks - mocking dependencies', () => {
        it('should call welcome method when user is created', async () => {
            const dbMock = sinon.mock({
                findByEmail: () => {},
                save: () => {}
              });
        
              // Set expectations
              dbMock.expects('findByEmail')
                .once()
                .withArgs('test@example.com')
                .resolves(null);
        
              dbMock.expects('save')
                .once()
                .withArgs(sinon.match({ 
                  email: 'test@example.com',
                  password: sinon.match.string 
                }))
                .resolves({ id: 1, email: 'test@example.com' });
        
              const userService = new UserService(dbMock.object);
              
              // Perform the action
              await userService.createUser({ 
                email: 'test@example.com', 
                password: 'password123' 
              });
        
              // Verify all expectations were met
              dbMock.verify();
        });
    });

    describe('complex', () => {
        it('should handle the complete user creation flow', async () => {
            // Stub database methods
            const dbStub = {
              findByEmail: sinon.stub().resolves(null),
              save: sinon.stub().resolves({ 
                id: 1, 
                email: 'test@example.com' 
              })
            };
      
            const userService = new UserService(dbStub);
            
            // Spy on sendWelcomeEmail
            const emailSpy = sinon.spy(userService, 'welcome');
      
            // Perform the action
            const user = await userService.createUser({ 
              email: 'test@example.com', 
              password: 'password123' 
            });
      
            // Verify everything worked as expected
            expect(dbStub.findByEmail.calledWith('test@example.com')).to.be.true;
            expect(dbStub.save.calledOnce).to.be.true;
            expect(user).to.deep.equal({ 
              id: 1, 
              email: 'test@example.com' 
            });
      
            // Clean up
            emailSpy.restore();
          });
    });
});