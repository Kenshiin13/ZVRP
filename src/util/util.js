"use strict";

const fs = require("fs");
const path = require("path");

/* Various utility functions. */

/**
 * The bots color palette. All used colors will be stored here as hexa decimals
 */
module.exports.colorPalette = {
    brandColor: 0x0077be
};

module.exports.actions = {
    kick: 0,
    mute: 1,
    ban: 2,
    unmute: 3
};

/**
 * Recursively read all files in a directory and its child directories.
 * @param {fs.PathLike} dirPath Path to the parent directory
 * @param {Array} arrayOfFiles Array to store all files in
 * @returns Returns all an array of files in the directory
 */
module.exports.getAllFilesSync = function getAllFilesSync(dirPath, arrayOfFiles)
{
    const files = fs.readdirSync(dirPath);

    arrayOfFiles = arrayOfFiles || [];
    files.forEach(function (file)
    {
        if (fs.statSync(dirPath + "/" + file).isDirectory())
            arrayOfFiles = getAllFilesSync(dirPath + "/" + file, arrayOfFiles);
        else arrayOfFiles.push(path.join(dirPath, "/", file));
    });

    return arrayOfFiles;
};

/**
 * Formats milliseconds to minutes and seconds. 298999 -> 4:59
 * @param {Number} ms The amount of milliseconds to format.
 * @returns Returns the formatted string.
 */
module.exports.msToMinAndSec = function (ms)
{
    var minutes = Math.floor(ms / 60000);
    var seconds = ((ms % 60000) / 1000).toFixed(0);
    return minutes + ":" + (seconds < 10 ? '0' : '') + seconds;
};

/**
 * Get an objects key by its value.
 * @param {Object} object A JS object.
 * @param {any} value The key to look for. 
 * @returns 
 */
module.exports.getKeyByValue = function (object, value)
{
    return Object.keys(object).find(key => object[key] === value);
}