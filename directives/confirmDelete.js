var wdywd = angular.module('wdywdApp')
	.directive('ngConfirmDelete', [
        function(){
            return {
                link: function (scope, element, attr) {
                    var msg = attr.ngConfirmDelete || "Are you sure?";
                    var clickAction = attr.confirmedDelete;
                    element.bind('click',function (event) {
                        if ( window.confirm(msg) ) {
                            scope.$eval(clickAction)
                        }
                    });
                }
            };
    }]);