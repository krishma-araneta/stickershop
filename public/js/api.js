var api = {
    getUserStickers: function (data, cb) {
        $.ajax({
            url: config.USER_STICKERS_URL.URL + '/' + data.content_uuid,
            type: config.USER_STICKERS_URL.METHOD,
            dataType: 'json',
            contentType: 'application/json',
            headers: {
                'X-API-Key': data.key,
            },
            success: function (response) {
                var responseData = { };
                responseData.uuid = data.content_uuid;
                responseData.svg = response.body;

                cb(responseData);
            },
            error: function (error) {
                cb({error:error});
            }
        });
    },
    buyUserSticker: function (collectionId, key, cb) {
        $.ajax({
            url: config.BUY_STICKER.URL,
            type: config.BUY_STICKER.METHOD,
            dataType: 'json',
            contentType: 'application/json',
            data: JSON.stringify({collection_id: collectionId, key: key}),
            success: function (response) {
                console.log(response)
                cb(response);
            },
            error: function (error) {
                cb({error:error});
            }
        });
    },
    getUsersCollections: function (key, cb) {
        $.ajax({
            url: config.USER_COLLECTIONS.URL,
            type: config.USER_COLLECTIONS.METHOD,
            dataType: 'json',
            contentType: 'application/json',
            data: {
                key: key,
            },
            success: cb,
            error: function (error) {
                 cb({error: error});
            }
        });
    },
    getDomainCollections: function (cb) {
        $.ajax({
            url: config.DOMAIN_COLLECTIONS.URL,
            type: config.DOMAIN_COLLECTIONS.METHOD,
            dataType: 'json',
            contentType: 'application/json',
            success: cb,
            error: function (err) {
                cb({error: err});
            }
        });
    },
    getCollections: function (cb) {
        $.ajax({
            url: config.COLLECTIONS.URL,
            type: config.COLLECTIONS.METHOD,
            dataType: 'json',
            contentType: 'application/json',
            success: cb,
            error: function (err) {
                cb({ error: err });
            }
        });
    },
    downloadStickers: function(data, success, failure, package_id, product_package_id){
                var xhr = new XMLHttpRequest();            
                xhr.onreadystatechange = function() {
                    if (xhr.readyState===4 && xhr.status===200) {
                        success(JSON.parse(xhr.responseText));
                    } else {
                        failure(JSON.parse(xhr.responseText));
                    }
                };
                xhr.open(config.VALIDATE_PURCHASE.METHOD, config.DOMAIN + config.VALIDATE_PURCHASE.URL);
                xhr.setRequestHeader('Content-Type', 'application/json');
                xhr.send(JSON.stringify(
                    {
                        userAccessToken: app.userData.key, 
                        packageId: 'stickersfree',
                        productPackageId: package_id, 
                        receiptId: 'bgydjeiejrier',
                        version: '123',
                        deviceId: '123',
                        deviceType: 48, 
                        os: 'IOS',
                        deviceName: 'Pc',
                        appVersion: '123'
                    }
                ));
    }
};




