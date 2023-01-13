const PORT = process.env.PORT || 8080
const express = require('express')
const axios = require('axios')
const cheerio = require('cheerio')
const { response } = require("express");
const e = require("express");

const app = express()
const newspapers = [
    {
        name: 'nytimes',
        address: 'https://www.nytimes.com/international/section/sports',
        base: 'https://www.nytimes.com/'
    },
    {
        name: 'guardian',
        address: 'https://www.theguardian.com/us/sport',
        base: 'https://www.theguardian.com/international'
    },
    {
        name: 'usatoday',
        address: 'https://www.usatoday.com/sports/',
        base: 'https://www.usatoday.com/'
    },
    {
        name: 'timesofindia',
        address: 'https://timesofindia.indiatimes.com/sports',
        base: 'https://timesofindia.indiatimes.com/'
    },
    {
        name: 'hindu',
        address: 'https://www.thehindu.com/sport/',
        base: 'https://www.thehindu.com/'
    },
]

const articles = []
app.get('/', (req, res) => {
    res.json('Hi')
})

newspapers.forEach(newspaper => {
    axios.get(newspaper.address)
        .then(response => {
            const html = response.data
            const $ = cheerio.load(html)
            $('a:contains("ball")', html).each(function () {
                const title = $(this).text()
                const url = $(this).attr('href')
                articles.push({
                    title,
                    url: newspaper.base + url,
                    source: newspaper.name
                })
            })
        })
})

app.get('/news', (req, res) => {
    // axios.get('https://www.nytimes.com/international/section/sports')
    //     .then((response)=>{
    //         const html = response.data
    //         const $ = cheerio.load(html)
    //
    //         $('a:contains("ball")', html).each(function (){
    //             const title = $(this).text()
    //             const url = $(this).attr('href')
    //             articles.push({
    //                 title,
    //                 url
    //             })
    //         })
    //         res.json(articles)
    //     }).catch((err)=>console.log(err))
    res.json(articles)
})

app.get('/news/:newspaperId', (req, res) => {
    const newspaperId = req.params.newspaperId

    const newspaperAddress = newspapers.filter(newspaper => newspaper.name == newspaperId)[0].address
    const newspaperBase = newspapers.filter(newspaper => newspaper.name == newspaperId)[0].base

    axios.get(newspaperAddress)
        .then(response => {
            const html = response.data
            const $ = cheerio.load(html)
            const specificarticles = []

            $('a:contains("ball")', html).each(function () {
                const title = $(this).text()
                const url = $(this).attr('href')
                specificarticles.push({
                    title,
                    url: newspaperBase + url,
                    source: newspaperId
                })
            })
            res.json(specificarticles)
        }).catch(err => console.log(err))
})

app.listen(PORT, () => console.log('server running on PORT ${PORT}'))