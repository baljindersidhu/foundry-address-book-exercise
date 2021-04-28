const fs = require('fs')
const es = require('event-stream');
const CONTACTS_STORE_PATH = "app-data/contacts.txt";

process.on("message", async (message) => {

    const {method} = message;

    if(method === 'GET'){
        const {pageNumber, pageSize} = message.details;
        const pageStartAt = pageNumber * pageSize;
        const pageEndAt = pageStartAt + pageSize;
        const {key} = message.details.sort;
        const {search} = message.details;
        const contacts = await readContacts(pageStartAt, pageEndAt, key, search).catch(() => process.send([]));
        process.send(contacts);
    }else if(method === 'ADD'){
        const {firstName, lastName, phoneNumber} = message.details;
        await addContact(firstName, lastName, phoneNumber);
        process.send("Done");
    }else if(method === 'REMOVE'){
        const {id} = message.details;
        await removeContact(id);
        process.send("Done");
    }


});

function readContacts(startIdx = 0, endIdx = 10, sortBy = 'firstName', searchTerm = ''){
    return new Promise((resolve, reject) => {
        let contacts = new Array();
        const _contactsStream = fs.createReadStream(CONTACTS_STORE_PATH)
                .pipe(es.split())
                .pipe(es.mapSync(function(line){
    
                // pause the readstream
                _contactsStream.pause();

                try{
                    contacts.push(JSON.parse(line));
                }catch(e){
                    console.error(`Error while parsing contact: ${line}`);
                }
    
                // resume the readstream, possibly from a callback
                _contactsStream.resume();
            })
            .on('error', function(err){
                console.log('Error while reading file.', err);
                reject();
            })
            .on('end', function(){
                if(searchTerm.length > 0){
                    const matchPropWithIgnoreCase = (contact, prop) => contact[prop].toLowerCase().includes(searchTerm.toLowerCase())
                    contacts = contacts
                        .filter(contact => {
                            try{
                                return matchPropWithIgnoreCase(contact, 'firstName') || matchPropWithIgnoreCase(contact, 'lastName')
                            }catch(e){
                                return false;
                            }
                        });
                }

                contacts.sort((a, b) => {
                    const propA = a[sortBy];
                    const propB = b[sortBy];
                    return propA.localeCompare(propB);
                });
                resolve(contacts.slice(startIdx, endIdx));
            })                                                                    
        );
    });
}

async function addContact(firstName, lastName, phoneNumber){
    const _stream = fs.createWriteStream(CONTACTS_STORE_PATH, {flags: 'a'});
    return new Promise((resolve, reject) => {
        try{
            _stream.write(JSON.stringify({
                id: Date.now(),
                firstName: firstName || '',
                lastName: lastName || '',
                phoneNumber: phoneNumber
            }) + '\n');
            resolve();
        }catch(e){
            reject();
        }finally{
            _stream.end();
        }
    });
}

async function removeContact(id){
    return new Promise((resolve, reject) => {
        resolve();
    });
}