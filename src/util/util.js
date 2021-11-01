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