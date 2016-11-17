/* global app, api, config, async, utils */

function Stickers() {
    $(window).on('resize', setStickersSectionSize);

    this.brand_banner_animation = [
        {
            post_delay_sec: 1,
            banner_image_uuid: 'banner_1'
        },
        {
            post_delay_sec: 1,
            banner_image_uuid: 'banner_2'
        }
    ];

    this.back = function () {
        document.querySelector('.main-view').classList.remove('preview');
        document.querySelector('.package-view').classList.add('fadeout');
        setTimeout(function () {
            clearPackageView();
            document.querySelector('.package-view').classList.remove('fadeout');
        }, 500);
    };

    function renderPackageView(id) {
        var template = getTemplateById('#packageViewTemplate');
        var packageView = document.querySelector('#packageView');
        var mainView = document.querySelector('.main-view');
        var package = _.find(app.stickers.collections, ['metadata.package_id', id]);
        clearPackageView();
        packageView.innerHTML = template;
        mainView.classList.add('preview');
        renderPackageDescription(package);
        renderPackage(package);
        mainView.scrollIntoViewIfNeeded();
        var tmpBackButton = document.querySelector('.temp-back-button');
        if (app.isMobile) {
            tmpBackButton.style.display = 'block';
            tmpBackButton.addEventListener('click', app.back);
        } else {
            tmpBackButton.style.display = 'none';
        }

        $('.download-btn').on('click', function (event) {
            var imguuid = _.find(app.stickers.collections, 'collection_id', event.target.dataset.packageId).panel_image_uuid;
            if (event.target.dataset.isFree === 'free' || event.target.dataset.purchased === 'true') {
                api.downloadStickers(app.userData,
                    function (res) {
                        event.target.classList.remove('visible');
                        event.target.dataset.downloaded = true;
                    },
                    function (error) {
                        event.target.classList.remove('visible');
                        event.target.dataset.downloaded = false;

                        //to do: update package info in list
                        console.log(error);
                    },
                    event.target.dataset.packageId,
                    event.target.dataset.purchasePackageId);
            } else if (app.userData.os.toLowerCase() === 'ios' || app.userData.os.toLowerCase() === 'iphone') {
                location.href = 'inapp://purchase/' + event.target.dataset.packageId + '/' + event.target.dataset.purchasePackageId + '/' + app.userData.key;
            } else {
                buyStickerPackage(event.target.dataset.packageId, imguuid);
            }
        });
    }

    function clearPackageView() {
        document.querySelector('#packageView').innerHTML = '';
    }

    function formatPrice(package, showPriceLabel) {
        if (package.metadata.purchased) {
            return 'Purchased';
        }

        var currency = package.metadata.currency === 'USD' ? '$' : package.currency;

        var prefix = showPriceLabel ? 'Price: ' : '';

        return prefix + (package.metadata.free ? 'Free' : package.metadata.cost + currency);
    }

    function renderPackageDescription(package) {
        var template = getTemplateById('#sticker-info-item');
        var packageContainer = document.querySelector('.package-info');
        var packageDescription = document.createElement('DIV');

        packageDescription.className = 'package';
        packageContainer.appendChild(utils.updateElement(template, {
            attr: {
                'src': package.metadata.package_img_url,
                'title': package.metadata.name,
                'data-collection-id': package.metadata.collection_id,
                'data-purchased': package.metadata.purchased || false,
                'data-package-id': package.collection_id,
                'data-is-free': package.metadata.free ? 'free' : 'paid',
            },
            content: {
                'data-name': package.name,
                'data-price': formatPrice(package, true),
                'data-title': '',
                'data-title-btn': (package.metadata.free || package.purchased) ? 'Download' : 'Buy',
                'data-description': package.description
            }
        }));
    }

    function changeSizeStickerList() {
        var stickers = document.querySelector('.stickers');
        var packageView = document.querySelector('.package-view');
        var description = document.querySelector('.description');
        var package = document.querySelector('.package-info');

        stickers.style.height = (packageView.offsetHeight - package.offsetHeight - description.offsetHeight) + 'px';
        stickers.style.top = (package.offsetHeight + description.offsetHeight) + 'px';
    }

    function renderPackage(package) {
        var template = getTemplateById('#stickers-image');
        var df = document.createDocumentFragment();

        df.appendChild(utils.updateElement(template, {
            attr: {
                'data-sticker-id': 'sticker_' + package.collection_id,
                'src': package.metadata.package_sprite,
                'onload': 'app.onImageLoaded();'
            }
        }));

        document.querySelector('.sticker-list').appendChild(df);
    }

    function onImageLoaded() {
        $('.stickers').addClass('fadeout');
        setTimeout(function () {
            $('.stickers').removeClass('loading');
            $('.stickers').removeClass('fadeout');
        }, 1000);
    }

    function setStickersSectionSize() {
        var height = $(window).height() - 220;
        $('section.stickers-group-list').css({height: height});
    }

    function bannerSlider() {
        var template = getTemplateById('#banner-slider');
        var container = document.querySelector('.stickers-group-slider');
        var isLastStep = false;
        var df = document.createDocumentFragment();

        function addSlide(item) {
            df.appendChild(utils.updateElement(template, {
                attr: {
                    'data-banner-id': item.banner_package_id,
                    'src': 'img/static_banner/' + item.banner_image_uuid + '.png'
                }
            }));
        }

        function startBannerSlider(slide) {
            if (app.brand_banner_animation.length === 0) {
                return;
            }

            var count = app.brand_banner_animation.length
            var delay = parseInt(app.brand_banner_animation[slide - 1].post_delay_sec, 10) * 1000;
            setTimeout(function () {
                document.querySelector('.stickers-group-slider').style['webkitTransform'] = 'translateX(-' + slide * 400 + 'px)';
                slide++;
                isLastStep = slide === count;
                startBannerSlider(isLastStep ? 1 : slide);
            }, delay + 1500);
        }

        app.brand_banner_animation.forEach(addSlide);
        if (app.brand_banner_animation.length > 1) {
            container.classList.add('animate');

            app.brand_banner_animation.push(app.brand_banner_animation[0]);
            addSlide(app.brand_banner_animation[0]);
            container.addEventListener('transitionend', function () {
                if (isLastStep) {
                    container.classList.remove('animate');
                    container.style['webkitTransform'] = 'translateX(0)';
                    setTimeout(function () {
                        container.classList.add('animate');
                    }, 200);
                }
            }, false);
            container.style.width = parseInt(app.brand_banner_animation.length, 10) * 400 + 'px';
        }
        container.appendChild(df);
        container.firstElementChild.onload = function () {
            startBannerSlider(1);
        };
    }

    function buyStickerPackage(packageId, imguuid) {
        var paymentURL = config.PAYMENT_URL +
                "stkrid=" + packageId +
                "&login=" + encodeURIComponent(app.userData.userId) +
                "&password=" + encodeURIComponent(app.userData.key) +
                "&stkruuid=" + imguuid +
                "&SHA_password=" + encodeURIComponent(app.userData.SHA_password) +
                "&appType=" + app.userData.appType +
                "&clientVersion=" + app.userData.clientVersion +
                "&deviceId=" + app.userData.deviceId +
                "&deviceType=" + app.userData.deviceType +
                "&key=" + encodeURIComponent(app.userData.key) +
                "&os=" + app.userData.os +
                "&userId=" + encodeURIComponent(app.userData.userId);
        location.href = paymentURL;
    }

    function renderPackageListView(packages) {
        var packageListView = document.querySelector('#packageListView');
        packageListView.innerHTML = getTemplateById('#packageListViewTemplate');
        renderPackageList(packages);
    }

    function collectionsClickEventHandler() {
        $('.stickers-group-preview').click(function (event) {
            event.stopPropagation();
            event.preventDefault();
            var id = $(this).attr('data-package-id');
            renderPackageView(id);
        });
    }

    function renderPackageList(packages) {
        var template = getTemplateById('#stickers-group-item');

        var df = document.createDocumentFragment();
        packages.forEach(function (item) {
            var el = utils.updateElement(template, {
                attr: {
                    'data-package-id': item.metadata.package_id,
                    'data-collection-id': item.metadata.collection_id,
                    'data-is-free': item.metadata.free ? 'free' : 'paid',
                    'data-downloaded': item.metadata.purchased || false,
                    'data-purchased': item.metadata.purchased || false,
                    'style': 'background-image: url(' + item.metadata.package_img_url + ')'
                },
                content: {
                    'data-package-name': item.metadata.name,
                    'data-package-price': formatPrice(item, false),
                }
            });

            df.appendChild(el);
        });

        document.querySelector('.stickers-group-list').appendChild(df);
        collectionsClickEventHandler();
    }

    function getTemplateById(id) {
        return document.querySelector(id).innerHTML;
    }

    function bind() {
        $('.filter-free-button').on('click', function (event) {
            document.querySelector('.stickers-group-list').classList.add('free');
            document.querySelector('.filter-all-button').classList.remove('active');
            event.target.classList.add('active');
            var freeStickers = document.querySelectorAll(".stickers-group-list.free .stickers-group-preview[data-is-free='free']");
            if (freeStickers.length > 0) {
                _.last(freeStickers).classList.add('last');
            }
        });

        $('.filter-all-button').on('click', function (event) {
            document.querySelector('.stickers-group-list').classList.remove('free');
            document.querySelector('.filter-free-button').classList.remove('active');
            event.target.classList.add('active');
        });

        $('.back').on('click', app.back);
    }

    function initBuySticker() {
        $('.stickers-group-download').on('click', function (e) {
            e.stopPropagation();
            e.preventDefault();
            var that = this;
            var collectionId = $(that).parent().attr('data-collection-id');
            api.buyUserSticker(collectionId, app.userData.userAccessToken, function (response) {
                if(!response.status) {
                    $(that).attr({
                        'data-downloaded': true,
                        'data-purchased': true,
                    });
                    $(that).parent().children('.stickers-group-item-price').empty().text('Purchased');
                }
            });
            return false;
        });
    }

    function getCollections(callback) {
        async.waterfall([
            function (next) {
                async.parallel({
                    juanachat: function (callback) {
                        api.getCollections(function (response) {
                            if (response.error) {
                                callback(response.error);
                            } else {
                                callback(null, response);
                            }
                        });
                    },
                    all: function (callback) {
                        api.getDomainCollections(function (response) {
                            if (response.error) {
                                callback(response.error);
                            } else {
                                callback(null, _.map(response.result.collections, 'collection'));
                            }
                        });
                    },
                    associated: function (callback) {
                        api.getUsersCollections(app.userData.userAccessToken, function (response) {
                            if (response.error) {
                                callback(response.error);
                            } else {
                                callback(null, response.result.collections);
                            }
                        });
                    },
                }, function (error, data) {
                    if (error) {
                        next(error);
                        return;
                    }

                    var collections = prepareCollections(data.all, data.associated, data.juanachat);

                    next(null, collections);
                });
            },
            function (collections, next) {
                async.map(collections, function (collection, callback) {
                    var uuid = collection.metadata.package_image_uuid;
                    if (uuid === undefined) {
                        callback(null, collection);
                        return;
                    }

                    var data = {
                        key: app.userData.userAccessToken,
                        content_uuid: uuid,
                    };
                    api.getUserStickers(data, function (success) {
                        _.merge(collection, success);
                        callback(null, collection);
                    });
                }, next);
            },
        ], callback); 
    }

    function prepareCollections(all, associated, juanachat) {
        all = _.cloneDeep(all);
        juanachat = _.cloneDeep(juanachat);

        _.forEach(juanachat, function (juanachatCollection) {
            var collection = _.find(all, function (item) {
                return item.metadata.package_id === juanachatCollection.metadata.package_id;
            });
            if (collection) {
                juanachatCollection.metadata.collection_id = collection.collection_id;
            }

            var associatedCollection = _.find(associated, function (item) {
                return item.collection_id === juanachatCollection.metadata.collection_id;
            });
            if(associatedCollection) {
                juanachatCollection.metadata.purchased = true;
            } else {
                juanachatCollection.metadata.purchased = false;
            }
        });

        return juanachat;
    }

    this.start = function () {
        if (app.isMobile) {
            document.querySelector('.main-view header').style.display = 'none';
            document.querySelector('#packageView').style.top = '0px';
        }

        document.querySelector('.main-view').classList.add('loading');
        $('.main-view').css('height', $(window).height() - 2);

        async.waterfall([
            function (next) {
                if (!app.userData.userAccessToken) {
                    next('NOT AUTHORIZED');
                    return;
                }

                next();
            },
            function (next) {
                getCollections(next);
            },
        ],
        function (error, collections) {
            if (error) {
                $('.main-view').removeClass('loading').addClass('error').empty().append($('<div>' + error + '</div>'));
                return;
            }

            app.stickers = {
                collections: collections,
            };

            renderPackageListView(collections);

            document.querySelector('.main-view').classList.remove('loading');
            $('.main-view').removeAttr('style');

            setStickersSectionSize();
            initBuySticker();
            bind();
            bannerSlider();
        });
    };

    this.onImageLoaded = onImageLoaded;
}

$(document).ready(function () {
    app = new Stickers();
    app.isMobile = _.some([ /iPad/i, /iPhone/i, /Android/i ], String.prototype.match.bind(window.navigator.userAgent));
    app.userData = config.USER_DATA;
    app.userData.userAccessToken = url('?key');
    app.start();
});

