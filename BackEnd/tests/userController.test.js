const userController = require('../Controllers/userController');
const collection = require('../Models/userModel');
const Project = require('../Models/project');

jest.mock('../Models/userModel');
jest.mock('../Models/project');

describe('User Controller', () => {
  let req, res;

  beforeEach(() => {
    req = {
      user: { _id: 'user123', username: 'john' }
    };
    res = {
      render: jest.fn(),
      status: jest.fn().mockReturnThis(),
      send: jest.fn()
    };
  });

  it('should render welcome page', () => {
    userController.welcome(req, res);
    expect(res.render).toHaveBeenCalledWith('index.ejs');
  });

  it('should render register page', () => {
    userController.register(req, res);
    expect(res.render).toHaveBeenCalledWith('Register.ejs');
  });

  it('should render AdminHome with user data', async () => {
    const fakeUser = { _id: 'user123', name: 'John' };
    collection.findById.mockResolvedValue(fakeUser);

    await userController.AdminHome(req, res);

    expect(collection.findById).toHaveBeenCalledWith('user123');
    expect(res.render).toHaveBeenCalledWith('AdminHome.ejs', { user: fakeUser });
  });

  it('should render ResearcherHome with projects', async () => {
    const fakeUser = { _id: 'user123', username: 'john' };
    const fakeProjects = [{ title: 'Project A' }, { title: 'Project B' }];

    collection.findById.mockResolvedValue(fakeUser);
    Project.find.mockResolvedValue(fakeProjects);

    await userController.ResearcherHome(req, res);

    expect(res.render).toHaveBeenCalledWith('ResearcherHome.ejs', {
      user: fakeUser,
      projects: fakeProjects
    });
  });

  it('should handle error in ResearcherHome gracefully', async () => {
    collection.findById.mockResolvedValue({ _id: 'user123', username: 'john' });
    Project.find.mockRejectedValue(new Error('DB Error'));

    await userController.ResearcherHome(req, res);

    expect(res.status).toHaveBeenCalledWith(500);
    expect(res.send).toHaveBeenCalledWith('Error retrieving your projects');
  });

  it('should render ReviewerHome', async () => {
    const fakeUser = { _id: 'user123', name: 'John' };
    collection.findById.mockResolvedValue(fakeUser);

    await userController.ReviewerHome(req, res);

    expect(res.render).toHaveBeenCalledWith('ReviewerHome.ejs', { user: fakeUser });
  });

  it('should render login with no error', () => {
    userController.login(req, res);
    expect(res.render).toHaveBeenCalledWith('login', { error: null });
  });
});
