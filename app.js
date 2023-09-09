// app.js
const express = require('express');

const app = express();

const db = require('./models/index');

const { Member } = db;

// let members = require('./members1.js');

// app.get('/hello', (req, res) => {
//     res.send('<h1>Hello Express</h1>');
// });

// middleware
app.use(express.json());

// app.use((req, res, next) => {
//     console.log(req.query);
//     next();
// });

// call back 함수 -> route handler라고도 부른다
app.get('/api/members', async (req, res) => {
    const {team} = req.query;
    if (team)
    {
        const teamMembers = await Member.findAll({ where: { team }});
        res.send(teamMembers);
    }
    else
    {
        // sequelize에 의해서 dbms로 전송된다
        const members = await Member.findAll();
        res.send(members);
    }
});

// :id -> route param
app.get('/api/members/:id', async (req, res) => {
    const {id} = req.params;
    const member = await Member.findOne({where: {id: id}});
    if (member)
    {
        res.send(member);
    }
    else
    {
        res.status(404).send({message : 'There is no member with the id!!'});
    }
});

app.post('/api/members', async (req, res) => {
    // console.log(req.body);
    const newMember = req.body;
    const member = Member.build(newMember);
    await member.save();
    console.log(member);
    res.send(newMember);
});

// 이게 무슨 소리지...
// app.put('/api/members/:id', async (req, res) => {
//     const {id} = req.params;
//     const newInfo = req.body;
//     const result = await Member.update(newInfo, {where: {id}});
//     // console.log(result);
//     if (result[0])
//     {
//         res.send({ message: `${result[0]} row(s) affected` });
//     }
//     else
//     {
//         res.status(404).send({message: 'There is no member with the id!!!'});
//     }
// });

// orm 방식으로 put 메서드 완성하기
app.put('/api/members/:id', async (req, res) => {
    const { id } = req.params;
    const newInfo = req.body;
    const member = await Member.findOne({ where: { id }});
    
    if (member)
    {
        Object.keys(newInfo).forEach((prop) => {
            member[prop] = newInfo[prop];
        });

        await member.save();
        res.send(member);

    }

    else
    {
        res.status(404).send({message: 'There is no id'});
    }
});

app.delete('/api/members/:id', async (req, res) => {
    const {id} = req.params;
    // destroy 메서드를 사용하면 해당 row만 삭제할 수 있다 -> 삭제된 개수가 return 된다
    const deleteCount = await Member.destroy({ where: { id }});
    
    if (deleteCount)
    {
        res.send({message: `${deleteCount} row(s) deleted`});
    }
    else
    {
        res.status(404).send({message: 'There is no member with the id!'});
    }
});

app.listen(3002, () => {
    console.log('Server is listening...');
});
