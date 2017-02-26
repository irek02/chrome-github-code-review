'use strict';

/*jslint browser: true*/
/*global $, jQuery, HotKeysService, HierarchyGeneratorService, DecorationService, AppInteractionService*/

function HierarchyGeneratorService() {
    this.cnt = 0;
}

HierarchyGeneratorService.prototype.generateAndApplyHierarchyHtml = function (files, hierarchy) {

    this.files = files;
    this.element = hierarchy;

    var compressedStructure = this.getCompressedHierarchy();
    this.generateAndApplyHtml(this.element, compressedStructure);

};

HierarchyGeneratorService.prototype.getCompressedHierarchy = function () {

    var structure = this.getHierarchyStructure(this.files);
    return this.compressHierarchy(structure);

};

HierarchyGeneratorService.prototype.getHierarchyStructure = function (files) {
    var result = {},
        key,
        parts;

    for (key in files) {
        if (files.hasOwnProperty(key)) {
            parts = files[key].split('/');
            this.addProp(result, parts);
        }
    }

    return result;
};

HierarchyGeneratorService.prototype.addProp = function (res, arr) {

    var fname, prop;

    if (arr.length === 1) {
        fname = arr.splice(0, 1);
        res[fname[0]] = fname[0];
        return;
    }

    if (arr.length > 1) {
        prop = arr.splice(0, 1);

        if (!res.hasOwnProperty(prop)) {
            res[prop] = {};
        }

        this.addProp(res[prop], arr);
    }

};

HierarchyGeneratorService.prototype.compressHierarchy = function (hierarchy) {

    function traverse(obj, newObj, path) {
        var key;

        for (key in obj) {

            if (obj.hasOwnProperty(key)) {
                if (!path || typeof obj[key] !== 'string') {
                    path = path + String(key) + '/';
                }

                if (typeof obj[key] === 'string') {

                    if (Object.keys(obj).length === 1) {
                        newObj[path] = {};
                        newObj[path][String(key) + '/'] = obj[key];
                    } else {
                        newObj[path] = obj[key];
                    }

                    path = "";
                } else if (typeof obj[key] === 'object' && Object.keys(obj[key]).length > 1) {
                    newObj[path] = {};
                    traverse(obj[key], newObj[path], "");
                    path = "";
                } else {
                    traverse(obj[key], newObj, path);
                    path = "";
                }
            }
        }
    }

    var newObj = {},
        path = "";

    traverse(hierarchy, newObj, path);

    return newObj;
};

HierarchyGeneratorService.prototype.generateAndApplyHtml = function (hierarchy, structure) {

    var list = $(document.createElement('ul')),
        that = this;

    $.each(structure, function (index, file) {

        var label = (typeof file === 'string') ? file : index,
            item = $('<li>' + label + '</li>');

        if (typeof structure[index] === 'object') {
            item.addClass('folder');
        } else if (typeof structure[index] === 'string') {
            item = $('<li><span class="file-name">' + label + '</span></li>');
            item.addClass('jk-file');
            item.attr("data-file-id", "diff-" + that.cnt);
            that.cnt = that.cnt + 1;
        }

        list.append(item);
        hierarchy.append(list);

        if (typeof structure[index] === 'object') {
            that.generateAndApplyHtml(list, structure[index]);
        }

    });

};
