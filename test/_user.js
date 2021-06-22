let User = require('../src/models/users');
let chai = require('chai');
let chaiHttp = require('chai-http');
let server = require('../app');
let should = chai.should();
chai.use(chaiHttp);


describe('User', () => {
    describe('/Empty user collection', () => {
        it('it should empty the table', (done) => {
            User.deleteMany({},(err) => {
                done()
            })
        });
    })

    describe('/register user', () => {
        it('it should register the user', (done) => {
            let user1 = {
                first_name: "Janak",
                last_name: "Harsora",
                email: "janak@gmail.com",
                password: "123456"
            }
            chai.request(server)
                .post('/api/auth/register')
                .send(user1)
                .end((err, res) => {
                    res.should.have.status(200);
                    res.body.should.be.a('object');
                    res.body.should.not.be.empty;
                    res.body.data.should.have.property('access_token');

                    let user2 = {
                        first_name: "jk",
                        last_name: "har",
                        email: "jkhar@gmail.com",
                        password: "123456"
                    }
                    chai.request(server)
                        .post('/api/auth/register')
                        .send(user2)
                        .end((err, res) => {
                            res.should.have.status(200);
                            res.body.should.be.a('object');
                            res.body.should.not.be.empty;
                            res.body.data.should.have.property('access_token');
                        });
                    done();
                });

        });
    });

    describe('/Login user', () => {
        it('it should login the user', (done) => {
            let cred = {
                email: "janak@gmail.com",
                password: "123456",
            }
            chai.request(server)
                .post('/api/auth/login')
                .send(cred)
                .end((err, res) => {
                    res.should.have.status(200);
                    res.body.should.be.a('object');
                    res.body.should.not.empty;
                    res.body.data.should.have.property('access_token');

                    var access_token = res.body.data.access_token;
                    describe('/GET user', () => {
                            it('it should get user profile details', (done) => {
                                chai.request(server)
                                    .get('/api/user_profile')
                                    .set({Authorization: access_token})
                                    .end((err, res) => {
                                        res.should.have.status(200);
                                        res.body.should.be.a('object');
                                        res.body.data.should.not.empty;



                                        describe('/PUT Update user detail', () => {
                                            it('it should update all user profile fields', (done) => {
                                                let data = {
                                                    first_name: "User1",
                                                    last_name: "User1_ls",
                                                    email: "user1@gmail.com"
                                                }
                                                chai.request(server)
                                                    .put(`/api/user/${res.body.data._id}`)
                                                    .send(data)
                                                    .set({Authorization: access_token})
                                                    .end((err, res) => {
                                                        res.should.have.status(200);
                                                        res.body.should.be.a('object');
                                                        res.body.should.not.empty;
                                                        done();
                                                    })
                                            })
                                        });


                                        describe('/PUT Update user detail', () => {
                                            it('it should be return error for duplicate email', (done) => {
                                                let data = {
                                                    email: "jkhar@gmail.com"
                                                }
                                                chai.request(server)
                                                    .put(`/api/user/${res.body.data._id}`)
                                                    .send(data)
                                                    .set({Authorization: access_token})
                                                    .end((err, res) => {
                                                        res.should.have.status(400);
                                                        res.body.should.be.a('object');
                                                        res.body.should.have.property('status')
                                                        res.body.should.have.property('message')
                                                        res.body.should.not.empty;
                                                        done();
                                                    })
                                            })
                                        });



                                        describe('/DELETE delete user', () => {
                                            it('it should be delete user from database table', (done) => {
                                                chai.request(server)
                                                    .delete(`/api/user/delete/${res.body.data._id}`)
                                                    .set({Authorization: access_token})
                                                    .end((err, res) => {
                                                        res.should.have.status(200);
                                                        res.body.should.be.a('object');
                                                        res.body.should.have.property('status')
                                                        res.body.should.have.property('message')
                                                        res.body.should.not.empty;
                                                        done();
                                                    })
                                            })
                                        });


                                        done();
                                    })
                                })
                            });


                    describe('/GET ALL USER', () => {
                        it('it should get all user profile details', (done) => {
                            chai.request(server)
                                .get('/api/get_all_users')
                                .set({Authorization: res.body.data.access_token})
                                .end((err, res) => {
                                    res.should.have.status(200);
                                    res.body.data.should.be.a('array');
                                    res.body.should.not.empty;
                                    done();
                                })
                        })
                    });
                    done();
                });
        });
    });

});