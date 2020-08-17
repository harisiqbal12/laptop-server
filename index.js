const fs = require('fs');
const http = require('http');
const url = require('url');
 

const json = fs.readFileSync(`${__dirname}/data/data.json`, 'utf-8');
const laptopData = JSON.parse(json);

// console.log(typeof laptopData);

// server.listen(1337, '127.0.0.1', () => {
//     console.log(`Listening for request now.`);
// });


const server = http.createServer((request, respond) => {

    const pathName = url.parse(request.url, true).pathname;
    // console.log(pathName);
    // const query = url.parse(request.url, true).query;
    const id = url.parse(request.url, true).query.id;
    // console.log(id);

    // console.log(pathName);

    // PRODUCT OVERVIEW
    if(pathName === '/products' || pathName === '/') {
        respond.writeHead(200, {
            'Content-type': 'text/html' 
        });
        
        fs.readFile(`${__dirname}/templates/template-overview.html`, 'utf-8', (err, data) => {
            let overviewOutput = data;
            fs.readFile(`${__dirname}/templates/template-card.html`, 'utf-8', (err, data) => {

                const cardOuput = laptopData.map(el => replaceTemplates(data, el)).join('');
                overviewOutput = overviewOutput.replace(/{%CARDS%}/g, cardOuput);

                respond.end(overviewOutput);
            });           
        });
 


        
        // LAPTOP 
    } else if (pathName === '/laptop' && id < laptopData.length) {
        respond.writeHead(200, {
            'Content-type': 'text/html'
        });
        fs.readFile(`${__dirname}/templates/template-laptop.html`, 'utf-8', (err, data) => {
            const laptop = laptopData[id];
            const output = replaceTemplates(data, laptop);
            respond.end(output);

        });


        // IMAGES
    } else if ((/\.(jpg|jpeg|png|gif)$/i).test(pathName)) {
        console.log(typeof pathName);

        fs.readFile(`${__dirname}/data/img${pathName}`, (err , data) => {
            respond.writeHead(200, {
                'Content-type': 'image/jpg'
            });
            respond.end(data);
        });
    }

    // URL NOT FOUND
    else {
        respond.writeHead(404, {
            'Content-type': 'text/html'
        });
        respond.end('URL NOT FOUND');
    }
});



server.listen(1337, '127.0.0.1', () => {
    console.log(`Listening for request now`);
});



// Functions
function replaceTemplates(originalTemplate, laptop) {
    let output = originalTemplate.replace(/{%PRODUCTNAME%}/g, laptop.productName);
    output = output.replace(/{%IMAGE%}/g, laptop.image);
    output = output.replace(/{%PRICE%}/g, laptop.price);
    output = output.replace(/{%SCREEN%/g, laptop.screen);
    output = output.replace(/{%CPU%}/g, laptop.cpu);
    output = output.replace(/{%STORAGE%}/g, laptop.storage);
    output = output.replace(/{%RAM%}/g, laptop.ram);
    output = output.replace(/{%DESCRIPTION%}/g, laptop.description);
    output = output.replace(/{%ID%}/g, laptop.id);

    return output;
}