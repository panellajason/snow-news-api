const PORT = process.env.PORT || 8000
const express = require('express')
const axios = require('axios')
const cheerio = require('cheerio')

const app = express()

const articles = []
const resorts = []

//News Sources
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
        name: 'Powder Chasers',
        address: 'https://powderchasers.com/forecasts',
        base: 'https://powderchasers.com'
    }
]

//Get News
newspapers.forEach(newspaper => {
    axios.get(newspaper.address)
    .then((websiteResponse) => {

        const html = websiteResponse.data
        const $ = cheerio.load(html)

        title = ''
        url = ''
        if(newspaper.name == 'Snow Brains') {

            $('article').each( function() {
                
                title = $(this).find('h2').text().trim()
                url = $(this).find('a').attr('href')
                articles.push({
                    title, url: newspaper.base + url, source: newspaper.name
                })
            })
        } else if(newspaper.name == 'Powder Chasers') {
    
            $('article').each( function() {
                
                title = $(this).find('b').text().trim()
                url = $(this).children('a').attr('href')
                articles.push({
                    title, url: newspaper.base + url, source: newspaper.name
                })
            })
        } else if(newspaper.name == 'Open Snow') {

            $('.link').each(function() {
                url = $(this).attr('href').toString()
                if (url.includes("mammoth") || (url.includes("tahoe") && !(url.includes("palisades"))) || url.includes("southerncalifornia")) {
                    title = $(this).parent().find('.name').text()
                    articles.push({
                        title, url: newspaper.base + url, source: newspaper.name
                    }) 
                }
            })     
        }
    })
})

//Get Forecast
axios.get('https://opensnow.com/dailysnow/southerncalifornia')
    .then((websiteResponse) => {

        const html = websiteResponse.data
        const $ = cheerio.load(html)

        $('.resort').each(function() {
            resort = $(this).children('.name').text()
            fiveDaySnowTotal = $(this).children('.snowfall.ml-auto').text().replace(/[^\d.-]/g, '')
            //url = 'https://opensnow.com/location/' + resort.replace(' ', '').replace('MountB', 'mtb')
            url = $(this).children('a').attr('href')
            resorts.push({
                resort, fiveDaySnowTotal, url: 'https://opensnow.com' + url
            })              
        })
    })
    axios.get('https://opensnow.com/dailysnow/mammoth')
    .then((websiteResponse) => {

        const html = websiteResponse.data
        const $ = cheerio.load(html)

        $('.resort').each(function() {
            resort = $(this).children('.name').text()
            fiveDaySnowTotal = $(this).children('.snowfall.ml-auto').text().replace(/[^\d.-]/g, '')
            url = $(this).children('a').attr('href')
            resorts.push({
                resort, fiveDaySnowTotal, url: 'https://opensnow.com' + url
            })              
        })
    })

//Home Page
app.get('/', (req, res) => {
    res.json('Welcome to Snow News!')
})

//All News
app.get('/allnews', (req, res) => {
    res.json(articles)
})

//5 day Snowfall Forecast
app.get('/forecast', (req, res) => {
    res.json(resorts)
})

app.listen(PORT, () => console.log(`Server running on port: ${PORT}`))
