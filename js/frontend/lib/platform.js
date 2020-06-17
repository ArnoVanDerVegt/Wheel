/**
 * Wheel, copyright (c) 2020 - present by Arno van der Vegt
 * Distributed under an MIT license: https://arnovandervegt.github.io/wheel/license.txt
**/
exports.isElectron = function() {
    return (typeof window === 'object') && ('electron' in window);
};

exports.isNode = function() {
    return (typeof document === 'object') && (document.location.hostname === '127.0.0.1');
};