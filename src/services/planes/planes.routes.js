const router = require('express').Router();


const planes ={
    monthly: {
        name: 'Monthly Plan',
        from: (()=>{
            const date = new Date();
            const [month, day, year]= [
            date.getMonth()+1, date.getDate(), date.getFullYear()];
            return date;
        })()
    },
    biannual: {},
    annual: {}
}

router.get('/planes', (req, res) => {
    res.json(planes);
});

module.exports = router;