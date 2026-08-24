import https from 'https';

const url = "https://en.wikipedia.org/w/api.php?action=query&generator=search&gsrsearch=Oktoberfest&gsrlimit=3&prop=pageimages&format=json&piprop=original";
https.get(url, { headers: { 'User-Agent': 'WayMark/1.0 (contact@example.com)' } }, (res) => {
    let data = '';
    res.on('data', chunk => data += chunk);
    res.on('end', () => {
        console.log("Status:", res.statusCode);
        console.log("Data:", data.substring(0, 200));
    });
}).on('error', console.error);
