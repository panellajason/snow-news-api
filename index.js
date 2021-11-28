const PORT = 8000
const express = require('express')
const axios = require('axios')
const cheerio = require('cheerio')

const expressInstance = express()
const articles = []
const newspapers = [
    {
        name: 'Open Snow',
        address: 'https://opensnow.com/dailysnow',
        base: 'https://opensnow.com'
    },
    {
        name: 'Snow Brains',
        address: 'https://snowbrains.com/category/weather',
        base: ''
    }, 
    {
        name: 'Unofficial Networks',
        address: 'https://unofficialnetworks.com/category/weather-2/',
        base: ''
    }
]

newspapers.forEach(newspaper => {

    axios.get(newspaper.address)
    .then((websiteResponse) => {

        const html = websiteResponse.data
        const $ = cheerio.load(html)

        title = ''
        url = ''
        if(newspaper.name == 'Snow Brains') {

            $('a:contains("Forecast:")', html).each(function() {
                title = $(this).text()
                url = $(this).attr('href')
                articles.push({
                    title, url: newspaper.base + url, source: newspaper.name
                })
            })
        } else if(newspaper.name == 'Unofficial Networks') {

            $('a:contains("Powder")', html).each(function() {
                title = $(this).text().replace(/\t|\n/g, '').replace('\\', '')
                url = $(this).attr('href')
                articles.push({
                    title, url: newspaper.base + url, source: newspaper.name
                })
            })
        } else if(newspaper.name == 'Open Snow') {

            $('.link').each(function() {
                url = $(this).attr('href').toString()
                if (url.includes("mammoth") || (url.includes("tahoe") && !(url.includes("palisades"))) || url.includes("southerncalifornia")) {
                    title = url.split('/')[2]
                    articles.push({
                        title, url: newspaper.base + url, source: newspaper.name
                    }) 
                }
                
            })
        }
    })
})
//Home Page
expressInstance.get('/', (req, res) => {
    res.json('Welcome to Snow News')
})

//All News
expressInstance.get('/allnews', (req, res) => {
    res.json(articles)
})

expressInstance.listen(PORT, () => console.log(`server running on PORT ${PORT}`))