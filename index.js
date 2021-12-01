const PORT = 8000
const express = require('express')
const axios = require('axios')
const cheerio = require('cheerio')

const app = express()
const articles = []
const resorts = []
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
                title = $(this).text().replace(/\t|\n/g, '').replace(/\\/g, '') 
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
app.get('/', (req, res) => {
    res.json('Welcome to Snow News')
})

//All News
app.get('/allnews', (req, res) => {
    res.json(articles)
})

//Snowfall Forecast
app.get('/forecast', (req, res) => {
    axios.get('https://opensnow.com/dailysnow/southerncalifornia')
    .then((websiteResponse) => {

        const html = websiteResponse.data
        const $ = cheerio.load(html)

        $('.resort').each(function() {
            resort = $(this).children('.name').text()
            fiveDaySnowTotal = $(this).children('.snowfall.ml-auto').text().replace(/[^\d.-]/g, '')
            url = 'https://opensnow.com/location/' + resort.replace(' ', '').replace('MountB', 'mtb')
            resorts.push({
                resort, fiveDaySnowTotal, url
            }) 
                        
        })
    })

    res.json(resorts)
})

app.listen(PORT, () => console.log(`Server running on port: ${PORT}`))
