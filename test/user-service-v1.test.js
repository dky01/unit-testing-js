const { expect } = require('mocha');
const sinon = require('sinon');

describe('user-service-v1', function () {
    let userService;
    let dbStub;
    let emailServiceStub;
    let sandbox;
    
    before(function () {
        console.log('start');
    });

    after(() => {
        console.log('after');
    });

    beforeEach(function () {
        sandbox = sinon.createSandbox();
        dbStub = {
            checkUserExists: sandbox.stub(),
            save: sandbox.stub(),
            findById: sandbox.stub(),
            update: sandbox.stub()
        };
        emailServiceStub = {
            welcome: sinon.stub()
        };
        userService = new UserService(dbStub, emailServiceStub);
    });

    afterEach(function () {
        sandbox.restore();
    });

    describe('create-user', () => {
        beforeEach(() => {
            dbStub.checkUserExists.resolves(null);
            dbStub.save.returns({ id: 1, email: 'test@example.com', name: 'foo', password: 'hashed-idk'});
            emailServiceStub.welcome.returns();
        })

        it('should create successfully', async () => {
            const user = { email: 'test@example.com', password: 'password123', name: 'foo' };
            return userService.createUser(user).then((createdUser) => {
                expect(createdUser).to.deep.equal({ id: 1, email: 'test@example.com', name: 'foo', password: 'hashed-idk' });
                expect(dbStub.checkUserExists.withArgs(user.email).calledOnce).to.be.true;
                expect(dbStub.save.withArgs(user).calledOnce).to.be.true;
                expect(emailServiceStub.welcome.withArgs({ email: 'test@example.com' }).calledOnce).to.be.true;
            });
        });

        it('should throw error if user already exists', async () => {
            dbStub.checkUserExists.resolves(true);
            const user = { email: 'test@example.com', password: 'password123', name: 'foo' };
            try {
                await userService.createUser(user);
                expect.fail('Should have thrown an error');
            } catch (error) {
                expect(error.message).to.equal('User already exists');
                expect(dbStub.checkUserExists.withArgs(user.email).calledOnce).to.be.true;
                expect(dbStub.save.withArgs(user).calledOnce).to.be.false;
                expect(emailServiceStub.welcome.called).to.be.false;
            } 
        });
    });

    describe('updateUser', () => {
        // Setup specific to updateUser tests
        beforeEach(() => {
          dbStub.findById.resolves({ 
            id: 1, 
            email: 'test@example.com' 
          });
          dbStub.update.resolves({ 
            id: 1, 
            email: 'updated@example.com' 
          });
        });
    
        it('should update user successfully', async () => {
          const userId = 1;
          const updateData = { email: 'updated@example.com' };
    
          const updatedUser = await userService.updateUser(userId, updateData);
    
          expect(updatedUser.email).to.equal('updated@example.com');
          expect(dbStub.findById.calledWith(userId)).to.be.true;
          expect(dbStub.update.calledWith(userId, updateData)).to.be.true;
        });
    
        it('should throw error if user not found', async () => {
          // Override default behavior for this specific test
          dbStub.findById.resolves(null);
    
          try {
            await userService.updateUser(999, { email: 'new@example.com' });
            expect.fail('Should have thrown an error');
          } catch (error) {
            expect(error.message).to.equal('User not found');
            expect(dbStub.update.called).to.be.false;
          }
        });
      });
    
      describe('Error handling', () => {
        it('should handle database errors gracefully', async () => {
          const dbError = new Error('Database connection failed');
          dbStub.findByEmail.rejects(dbError);
    
          try {
            await userService.createUser({ 
              email: 'test@example.com', 
              password: 'password123' 
            });
            expect.fail('Should have thrown an error');
          } catch (error) {
            expect(error).to.equal(dbError);
            expect(dbStub.save.called).to.be.false;
            expect(emailServiceStub.sendWelcomeEmail.called).to.be.false;
          }
        });
      });
    
      describe('Input validation', () => {
        const testCases = [
          { 
            description: 'missing email',
            input: { password: 'password123' },
            expectedError: 'Email and password are required'
          },
          {
            description: 'missing password',
            input: { email: 'test@example.com' },
            expectedError: 'Email and password are required'
          }
        ];
    
        // Using forEach for parameterized tests
        testCases.forEach(({ description, input, expectedError }) => {
          it(`should validate ${description}`, async () => {
            try {
              await userService.createUser(input);
              expect.fail('Should have thrown an error');
            } catch (error) {
              expect(error.message).to.equal(expectedError);
              expect(dbStub.findByEmail.called).to.be.false;
            }
          });
        });
      });
});