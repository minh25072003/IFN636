const chai = require('chai');
const chaiHttp = require('chai-http');
const mongoose = require('mongoose');
const app = require('../server');
require('dotenv').config();

chai.use(chaiHttp);
const { expect } = chai;

let token = '';
let playlistId = '';
let videoId = '';

// ─── SETUP & TEARDOWN ─────────────────────────────────────────
before(async () => {
  if (mongoose.connection.readyState === 0) {
    await mongoose.connect(process.env.MONGO_URI);
  }
  // clean up test user from previous runs
  await mongoose.connection.collection('users').deleteOne({ email: 'testuser@example.com' });
});

after(async () => {
  // clean up test data
  await mongoose.connection.collection('users').deleteOne({ email: 'testuser@example.com' });
  await mongoose.disconnect();
});

// ─── AUTH TESTS ───────────────────────────────────────────────
describe('Auth', () => {
  it('should register a new user', (done) => {
    chai.request(app)
      .post('/api/auth/register')
      .send({ name: 'Test User', email: 'testuser@example.com', password: 'password123' })
      .end((err, res) => {
        expect(res).to.have.status(201);
        expect(res.body).to.have.property('token');
        done();
      });
  });

  it('should not register with an existing email', (done) => {
    chai.request(app)
      .post('/api/auth/register')
      .send({ name: 'Test User', email: 'testuser@example.com', password: 'password123' })
      .end((err, res) => {
        expect(res).to.have.status(400);
        expect(res.body.message).to.equal('User already exists');
        done();
      });
  });

  it('should login with correct credentials', (done) => {
    chai.request(app)
      .post('/api/auth/login')
      .send({ email: 'testuser@example.com', password: 'password123' })
      .end((err, res) => {
        expect(res).to.have.status(200);
        expect(res.body).to.have.property('token');
        token = res.body.token;
        done();
      });
  });

  it('should not login with wrong password', (done) => {
    chai.request(app)
      .post('/api/auth/login')
      .send({ email: 'testuser@example.com', password: 'wrongpassword' })
      .end((err, res) => {
        expect(res).to.have.status(401);
        done();
      });
  });

  it('should get user profile when authenticated', (done) => {
    chai.request(app)
      .get('/api/auth/profile')
      .set('Authorization', `Bearer ${token}`)
      .end((err, res) => {
        expect(res).to.have.status(200);
        expect(res.body).to.have.property('email');
        done();
      });
  });

  it('should reject profile request without token', (done) => {
    chai.request(app)
      .get('/api/auth/profile')
      .end((err, res) => {
        expect(res).to.have.status(401);
        done();
      });
  });
});

// ─── PLAYLIST TESTS ───────────────────────────────────────────
describe('Playlists', () => {
  it('should create a new playlist', (done) => {
    chai.request(app)
      .post('/api/playlists')
      .set('Authorization', `Bearer ${token}`)
      .send({ title: 'My Rap Playlist', description: 'All rap songs' })
      .end((err, res) => {
        expect(res).to.have.status(201);
        expect(res.body).to.have.property('_id');
        expect(res.body.title).to.equal('My Rap Playlist');
        playlistId = res.body._id;
        done();
      });
  });

  it('should get all playlists for the user', (done) => {
    chai.request(app)
      .get('/api/playlists')
      .set('Authorization', `Bearer ${token}`)
      .end((err, res) => {
        expect(res).to.have.status(200);
        expect(res.body).to.be.an('array');
        done();
      });
  });

  it('should get a single playlist by id', (done) => {
    chai.request(app)
      .get(`/api/playlists/${playlistId}`)
      .set('Authorization', `Bearer ${token}`)
      .end((err, res) => {
        expect(res).to.have.status(200);
        expect(res.body._id).to.equal(playlistId);
        done();
      });
  });

  it('should update a playlist', (done) => {
    chai.request(app)
      .put(`/api/playlists/${playlistId}`)
      .set('Authorization', `Bearer ${token}`)
      .send({ title: 'Updated Playlist' })
      .end((err, res) => {
        expect(res).to.have.status(200);
        expect(res.body.title).to.equal('Updated Playlist');
        done();
      });
  });

  it('should not get playlists without token', (done) => {
    chai.request(app)
      .get('/api/playlists')
      .end((err, res) => {
        expect(res).to.have.status(401);
        done();
      });
  });
});

// ─── VIDEO TESTS ──────────────────────────────────────────────
describe('Videos', () => {
  it('should add a video to a playlist', (done) => {
    chai.request(app)
      .post(`/api/playlists/${playlistId}/videos`)
      .set('Authorization', `Bearer ${token}`)
      .send({
        title: 'Not Like Us - Kendrick Lamar',
        url: 'https://www.youtube.com/watch?v=T6eK-2OBs7s',
        duration: '3:17',
        category: 'Rap',
      })
      .end((err, res) => {
        expect(res).to.have.status(201);
        expect(res.body).to.have.property('video');
        videoId = res.body.video._id;
        done();
      });
  });

  it('should get all videos in a playlist', (done) => {
    chai.request(app)
      .get(`/api/playlists/${playlistId}/videos`)
      .set('Authorization', `Bearer ${token}`)
      .end((err, res) => {
        expect(res).to.have.status(200);
        expect(res.body).to.be.an('array');
        done();
      });
  });

  it('should update a video', (done) => {
    chai.request(app)
      .put(`/api/playlists/${playlistId}/videos/${videoId}`)
      .set('Authorization', `Bearer ${token}`)
      .send({
        title: 'Not Like Us - Kendrick Lamar (Updated)',
        url: 'https://www.youtube.com/watch?v=T6eK-2OBs7s',
        duration: '3:17',
        category: 'Rap',
      })
      .end((err, res) => {
        expect(res).to.have.status(200);
        expect(res.body.title).to.equal('Not Like Us - Kendrick Lamar (Updated)');
        done();
      });
  });

  it('should search videos by title', (done) => {
    chai.request(app)
      .get('/api/videos?search=Kendrick')
      .set('Authorization', `Bearer ${token}`)
      .end((err, res) => {
        expect(res).to.have.status(200);
        expect(res.body).to.be.an('array');
        done();
      });
  });

  it('should remove a video from a playlist', (done) => {
    chai.request(app)
      .delete(`/api/playlists/${playlistId}/videos/${videoId}`)
      .set('Authorization', `Bearer ${token}`)
      .end((err, res) => {
        expect(res).to.have.status(200);
        expect(res.body.message).to.equal('Video removed');
        done();
      });
  });

  it('should delete a playlist', (done) => {
    chai.request(app)
      .delete(`/api/playlists/${playlistId}`)
      .set('Authorization', `Bearer ${token}`)
      .end((err, res) => {
        expect(res).to.have.status(200);
        expect(res.body.message).to.equal('Playlist deleted');
        done();
      });
  });
});