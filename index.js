const mongoose = require('mongoose');
const express = require('express');
const app = express();
app.use(express.json());

app.engine('pug', require('pug').__express)
app.set('view engine', 'pug');
// app.set('views', './views');

mongoose.connect('mongodb://localhost/work')
  .then(() => console.log('Connected to MongoDB...'))
  .catch(err => console.error('Could not connect to MongoDB...'));


const Problem = mongoose.model('Problem', new mongoose.Schema({
  qqqq: Number,
  question: String,
  correct: String,
  alt_response: [String],
  explanation: String,
  tags: [String]
}));

//GET all problems
app.get('/', async (req, res) => {
  const problems = await Problem.find().sort('qqqq');
  res.send(problems);
});

//GET specific problem by number
app.get('/api/problems/:q', async (req, res) => {
    const problems = await Problem.find( {qqqq : parseInt(req.params.q)} );
    res.send(problems[0]);
  });

//GET problems by tag
app.get('/api/problems/tags/:t', async (req, res) => {
    const problems = await Problem.find( {tags : req.params.t} );
    res.send(problems[0]);
  });

  //POST a new problems
app.post('/api/problems/add', async (req, res) => {
    //const problems = await Problem.find( {tags : req.params.t} );
    const problem = new Problem(
        {qqqq: '3', 
        question: req.body.question, 
        correct: req.body.correct}
    )
    const p = await problem.save()
    res.send(p);
  });

//GET problem formatted via PUG
app.get('/api/problems/pug/:q', async (req, res) => {
    const problem = await Problem.find( {qqqq: parseInt(req.params.q)} );
    // res.send(problem[0]);
    res.render('problem', {
        q: problem[0].question,
        c: problem[0].correct
    });
  });

const port = process.env.PORT || 3000;
app.listen(port, () => console.log(`Listening on port ${port}...`));