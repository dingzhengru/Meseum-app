'use strict';

Object.defineProperty(exports, "__esModule", {
    value: true
});
/*
    global Firebase
    global angular
    global moment
    global Storage
    global localStorage
*/

// Firebase
var ref = new Firebase('https://scorching-inferno-8541.firebaseio.com');
var demoRef = ref.child('demo');
var userRef = ref.child('users');

var mainApp = angular.module('mainApp', ['ui.router', 'ngStorage', 'firebase', 'ja.qr', 'qrScanner', 'angularSmoothscroll'])

// Filter
.filter('str', function () {
    return function (input) {
        input = input || 0;
        return input.toString(10);
    };
}).config(function ($stateProvider, $urlRouterProvider) {
    $stateProvider.state('home', {
        url: '/',
        templateUrl: 'templates/home.html',
        controller: function controller($scope, $http, $location, $localStorage, $anchorScroll, $timeout) {
            $scope.setPageTitle('Home');

            // ----------------- About Section

            // ----------------- About Section -/
            // ----------------- About-items Section

            $http.get('https://my-webmobile-dingzhengru.c9users.io:8080/meseumItems/all').success(function (data) {
                $scope.items = data;
                $scope.selectedItem = $scope.items[0];
            });
            $scope.selectItem = function (item) {
                return $scope.selectedItem = item;
            };

            // ----------------- About-items Section -/
            // ----------------- Shop Section

            $http.get('https://my-webmobile-dingzhengru.c9users.io:8080/shopItems/all').success(function (data) {
                $scope.shopItems = data;
                // 從Storage拿出數量 // storage 跟 原data比較 // index為原data位置 i為storage位置

                var _loop = function _loop(i) {
                    $scope.shopItems.forEach(function (item, index) {
                        if (item.id == $localStorage.shoppingCart[i].id) {
                            $scope.shoppingCartQuantity[index] = $localStorage.shoppingCart[i].quantity;
                        }
                    });
                };

                for (var i = 0; i < $localStorage.shoppingCart.length; i++) {
                    _loop(i);
                }
            });

            // Init $localStorage
            if (!$localStorage.shoppingCart) {
                $localStorage.$default({ shoppingCart: [] });
            };

            $scope.shoppingCartQuantity = [];
            $scope.shoppingCart = $localStorage.shoppingCart;

            // 從Storage拿出數量
            // for(let i=0; i<$localStorage.shoppingCart.length; i++) {
            //     $scope.shopItems.forEach((item, index) => {
            //         if(item.id == $localStorage.shoppingCart[i].id) {
            //             $scope.shoppingCartQuantity[index] = $localStorage.shoppingCart[index].quantity;
            //         }
            //     });
            // }
            // $scope.shoppingCartQuantity[i] = $localStorage.shoppingCart[i].quantity;

            $scope.isInShop = function (shopItem) {
                return $scope.arrayObjectIndexOf($localStorage.shoppingCart, shopItem, 'id') >= 0;
            };
            $scope.addShopItem = function (shopItem, index) {
                // 若沒輸入 或是 0 就為 1
                $scope.shoppingCartQuantity[index] = $scope.shoppingCartQuantity[index] || 1;
                shopItem.quantity = $scope.shoppingCartQuantity[index];
                $localStorage.shoppingCart.push(shopItem);
            };
            $scope.removeShopItem = function (shopItem, index) {
                var shopItemIndex = $scope.arrayObjectIndexOf($localStorage.shoppingCart, shopItem, 'id');
                $localStorage.shoppingCart.splice(shopItemIndex, 1);
                $scope.shoppingCartQuantity[index] = undefined;
            };
            // delete $localStorage.shoppingCart;
            console.log($localStorage.shoppingCart);

            $scope.checkoutQR = function () {
                var itemIdList = [];
                var itemQuantityList = [];
                $localStorage.shoppingCart.forEach(function (item, index) {
                    if (item.id) {
                        itemIdList.push(item.id);
                        itemQuantityList.push(item.quantity);
                    }
                });
                console.log([itemIdList, itemQuantityList]);
                return {
                    text: JSON.stringify([itemIdList, itemQuantityList]),
                    typeNumber: 0, // 0~40
                    correctionLevel: '', // L M Q H (default 'M')
                    size: 200, // (default 200)
                    inputMode: '', //  NUMBER, ALPHA_NUM, 8bit (default '' is auto)
                    image: true
                };
            };
            // ----------------- Shop Section -/
        }
    }).state('detail', {
        url: '/detail/{itemId:int}',
        templateUrl: 'templates/detail.html',
        controller: function controller($scope, $stateParams, $http) {
            $scope.setPageTitle('Detail');

            $scope.item = { id: $stateParams.itemId };
            $http.get('https://my-webmobile-dingzhengru.c9users.io:8080/meseumItems/all').success(function (data) {
                $scope.items = data;
                var index = $scope.arrayObjectIndexOf(data, $scope.item, 'id');
                $scope.item = $scope.items[index];
                console.log($scope.item);
            });
        }
    }).state('detail-scanner', {
        url: '/detail-scanner',
        templateUrl: 'templates/detail-scanner.html',
        controller: function controller($scope, $state, $window, $timeout) {
            $scope.setPageTitle('QR Scanner(Detail)');

            $scope.onSuccess = function (data) {
                $state.go('detail', { itemId: parseInt(data) });
                $timeout(function () {
                    return $window.location.reload();
                }, 500);
            };
            $scope.onError = function (error) {
                console.error(error);
            };
        }
    }).state('check-scanner', {
        url: '/check-scanner',
        templateUrl: 'templates/check-scanner.html',
        controller: function controller($scope, $http, $window) {
            $scope.setPageTitle('QR Scanner(check)');

            //------------- Shake

            $scope.orientation = {};
            $scope.shake = {
                deltaTime: 0, // 現在與最後一次的差距時間(毫秒)
                currentTime: new Date(), // 現在的timestamp(毫秒)
                lastTime: new Date(), // 最後的timestamp(毫秒)
                settings: {
                    delta: 5, // 判斷搖動大小設定
                    timeout: 1000 }
            };

            // 多久判斷一次
            $scope.detactShake = function (event) {
                $scope.shake.currentTime = new Date();
                $scope.shake.deltaTime = $scope.shake.currentTime.getTime() - $scope.shake.lastTime.getTime();

                if ($scope.shake.deltaTime >= $scope.shake.settings.timeout || !$scope.orientation) {

                    // 現在 - 最後一次 >= 設定的大小
                    if (Math.abs($scope.orientation.x - event.accelerationIncludingGravity.x) >= $scope.shake.settings.delta && Math.abs($scope.orientation.y - event.accelerationIncludingGravity.y) >= $scope.shake.settings.delta && Math.abs($scope.orientation.z - event.accelerationIncludingGravity.z) >= $scope.shake.settings.delta) {
                        $scope.shake.isShake = true;
                        $scope.detactShakeStop();
                        $scope.detactShakeReset();
                    }

                    $scope.orientation.x = Math.round(event.accelerationIncludingGravity.x);
                    $scope.orientation.y = Math.round(event.accelerationIncludingGravity.y);
                    $scope.orientation.z = Math.round(event.accelerationIncludingGravity.z);

                    $scope.shake.lastTime = new Date();
                }
            };

            $scope.detactShakeStart = function () {
                return window.addEventListener('devicemotion', $scope.detactShake);
            };
            $scope.detactShakeStop = function () {
                return window.removeEventListener('devicemotion', $scope.detactShake);
            };
            $scope.detactShakeReset = function () {
                return $scope.orientation = {};
            };

            if ('ondevicemotion' in window) $scope.detactShakeStart();

            //------------- Shake -----------//

            $scope.onSuccess = function (data) {
                $scope.shopItemList = JSON.parse(data);
                $scope.shopItemIdList = $scope.shopItemList[0];
                $scope.shopItemQuantityList = $scope.shopItemList[1];
                $http.get('https://my-webmobile-dingzhengru.c9users.io:8080/shopItems/all').success(function (data) {
                    $scope.shopItems = data.filter(function (item, index) {
                        for (var i = 0; i < $scope.shopItemIdList.length; i++) {
                            if ($scope.shopItemIdList[i] == item.id) {
                                // 將數量加上去
                                item.quantity = $scope.shopItemQuantityList[i];
                                return true;
                            }
                        }
                        return false;
                    });
                    console.log($scope.shopItems);
                });
            };
            $scope.onError = function (error) {
                console.log('QR Error:', error);
            };

            $scope.shopSum = function () {
                if (!$scope.shopItems) return 0;
                var sum = 0;
                for (var i = 0; i < $scope.shopItems.length; i++) {
                    sum = sum + $scope.shopItems[i].quantity * $scope.shopItems[i].price;
                }return sum;
            };
        }
    });

    $urlRouterProvider.otherwise('/');
}).controller('MainController', function ($scope, $http, $location, $firebaseObject, $firebaseArray) {
    $scope.setPageTitle = function (pageTitle) {
        $scope.pageTitle = pageTitle;
    };
    $scope.isActive = function (viewLocation) {
        return viewLocation === $location.path();
    };
    $scope.arrayObjectIndexOf = function (myArray, searchItem, property) {
        for (var i = 0, len = myArray.length; i < len; i++) {
            if (myArray[i][property] === searchItem[property]) return i;
        }
        return -1;
    };

    $scope.templates = {
        nav: 'templates/nav.html',
        footer: 'templates/footer.html'
    };
});

exports.default = mainApp;


angular.element(document).ready(function () {
    return angular.bootstrap(document, ['mainApp']);
});