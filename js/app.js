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

.config(function($stateProvider, $urlRouterProvider) {
    $stateProvider
        .state('home', {
            url: '/',
            templateUrl: 'templates/home.html',
            controller: function($scope, $http, $location, $localStorage, $anchorScroll) {
                $scope.setPageTitle('Home');
                
                // ----------------- About Section 
                
                // ----------------- About Section -/
                // ----------------- About-items Section 
                
                $http.get('https://my-webmobile-dingzhengru.c9users.io:8081/meseumItems/all').success((data) => {
                    $scope.items = data;
                    $scope.selectedItem = $scope.items[0];
                });
                $scope.selectItem = (item) => $scope.selectedItem = item;
                    
                // ----------------- About-items Section -/
                // ----------------- Shop Section 
                
                $http.get('https://my-webmobile-dingzhengru.c9users.io:8081/shopItems/all').success((data) => {
                    $scope.shopItems = data;
                });

                // Init $localStorage
                if(!$localStorage.shoppingCart) {
                    $localStorage.$default({ shoppingCart: [] });
                };
                
                $scope.shoppingCartQuantity = [];
                $scope.shoppingCart = $localStorage.shoppingCart;
                
                // 從Storage拿出數量
                for(let i=0; i<$localStorage.shoppingCart.length; i++)
                    $scope.shoppingCartQuantity[i] = $localStorage.shoppingCart[i].quantity;
                    
                $scope.isInShop = (shopItem) => {
                    return $scope.arrayObjectIndexOf($localStorage.shoppingCart, shopItem, 'id') >= 0;
                };
                $scope.addShopItem = (shopItem, index) => {
                    // 若沒輸入 或是 0 就為 1
                    $scope.shoppingCartQuantity[index] =  $scope.shoppingCartQuantity[index] || 1;
                    shopItem.quantity = $scope.shoppingCartQuantity[index];
                    $localStorage.shoppingCart.push(shopItem);
                };
                $scope.removeShopItem = (shopItem, index) => {
                    let shopItemIndex = $scope.arrayObjectIndexOf($localStorage.shoppingCart, shopItem, 'id');
                    $localStorage.shoppingCart.splice(shopItemIndex, 1);
                    $scope.shoppingCartQuantity[index] = undefined;
                };
                // delete $localStorage.shoppingCart;
                console.log($localStorage.shoppingCart);
                
                $scope.checkoutQR = () => {
                    let itemIdList = [];
                    let itemQuantityList = [];
                    $localStorage.shoppingCart.forEach((item, index) => {
                        if(item.id) {
                            itemIdList.push(item.id);
                            itemQuantityList.push(item.quantity);
                        }
                    });
                    console.log([itemIdList, itemQuantityList]);
                    return {
                        text: JSON.stringify([itemIdList, itemQuantityList]), 
                        typeNumber: 0,          // 0~40
                        correctionLevel: '',    // L M Q H (default 'M')
                        size: 200,              // (default 200)
                        inputMode: '',          //  NUMBER, ALPHA_NUM, 8bit (default '' is auto)
                        image: true,
                    };
                }
                // ----------------- Shop Section -/
                
            }
        })
        .state('detail', {
            url: '/detail/{itemId:int}',
            templateUrl: 'templates/detail.html',
            controller: function($scope, $stateParams) {
                $scope.setPageTitle('Detail');
                
                $scope.itemId = $stateParams.itemId;
            }
        })
        .state('check-scanner', {
            url: '/check-scanner',
            templateUrl: 'templates/check-scanner.html',
            controller: function($scope, $http) {
                $scope.setPageTitle('QR Scanner(check)');
                
                $scope.shopItemList = JSON.parse('[[3415149900017, 7500200100140, 3403479900869], [20, 18, 15]]');
                $scope.shopItemIdList = $scope.shopItemList[0];
                $scope.shopItemQuantityList = $scope.shopItemList[1];
                $http.get('https://my-webmobile-dingzhengru.c9users.io:8081/shopItems/all').success((data) => {
                    $scope.shopItems = data.filter((item, index) => {
                        for(let i=0; i<$scope.shopItemIdList.length; i++) {
                            if($scope.shopItemIdList[i] == item.id) {
                                // 將數量加上去
                                item.quantity = $scope.shopItemQuantityList[i];
                                return true;
                            }
                        }
                        return false;
                    });
                    console.log($scope.shopItems);
                });
                $scope.shopSum = () => {
                    let sum = 0;
                    for(let i=0; i<$scope.shopItems.length; i++)
                        sum = sum + $scope.shopItems[i].quantity * $scope.shopItems[i].price;
                    return sum;
                }
                
                // $scope.onSuccess = function(data) {
                //     $scope.shopItemList = JSON.parse(data);
                //     $scope.shopItemIdList = $scope.shopItemList[0];
                //     $scope.shopItemQuantityList = $scope.shopItemList[1];
                //     $http.get('http://my-webmobile-dingzhengru.c9users.io:8081/shopItems/all').success((data) => {
                //             $scope.shopItems = data.filter((item, index) => {
                //                 for(let i=0; i<$scope.shopItemIdList.length; i++) {
                //                     if($scope.shopItemIdList[i] == item.id) {
                //                         // 將數量加上去
                //                         item.quantity = $scope.shopItemQuantityList[i];
                //                         return true;
                //                     }
                //                 }
                //                 return false;
                //             });
                //             console.log($scope.shopItems);
                //     });
                // };
                $scope.onError = function(error) {
                    console.log(error);
                };
            }
        })
        .state('detail-scanner', {
            url: '/detail-scanner',
            templateUrl: 'templates/detail-scanner.html',
            controller: function($scope) {
                $scope.setPageTitle('QR Scanner(Detail)');
            }
        })
    $urlRouterProvider.otherwise('/');
})

.controller('MainController', function($scope, $http, $location, $firebaseObject, $firebaseArray) {
    $scope.setPageTitle = function(pageTitle) {
        $scope.pageTitle = pageTitle;
    };
    $scope.isActive = function(viewLocation) { 
        return viewLocation === $location.path();
    };
    $scope.arrayObjectIndexOf = function(myArray, searchItem, property) {
        for(let i = 0, len = myArray.length; i < len; i++) {
            if (myArray[i][property] === searchItem[property]) return i;
        }
        return -1;
    }
    
    $scope.templates = {
        nav: 'templates/nav.html',
        footer: 'templates/footer.html'
    };
});

export default mainApp;

angular.element(document).ready(function() {
    return angular.bootstrap(document, ['mainApp']);
});