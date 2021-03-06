/**
 * The main application class. An instance of this class is created by app.js when it calls
 * Ext.application(). This is the ideal place to handle application launch and initialization
 * details.
 */

// TODO:
//  -> submit multiples from multiselect/tree
//  -> do not allow empty submit
//  -> lab units
//  -> vital units
//  -> 'cache' attribute

// See https://github.com/yogeshpandey009/Ext.ux.Exporter/
Ext.Loader.setConfig({
    enabled: true,
    paths: {
        'Ext.ux.exporter': 'exporter',
        'Overrides': 'overrides'
    }
});

Ext.define('cardioCatalogQT.Application', {
    extend: 'Ext.app.Application',
    
    name: 'cardioCatalogQT',

    requires: [
        'Ext.app.*',
        'cardioCatalogQT.config.Config',
        'Ext.ux.exporter.Exporter',
        'Ext.state.CookieProvider',
        'Ext.window.MessageBox',
        'Ext.tip.QuickTipManager',
        'Ext.form.Panel',
        'Ext.ux.form.MultiSelect',
        'Ext.ux.form.ItemSelector',
        'cardioCatalogQT.*',
        'Ext.overrides.selection.CheckboxModel',
        'Ext.overrides.view.MultiSelectorSearch'
    ],

    stores: [
        'Attributes',
        'BasicVitals',
        'Diagnoses',
        'Labs',
        'Procedures',
        'Payload',
        'Queries',
        'Results',
        'TestResults',
        'Races',
        'Ethnicities'
    ],

    init: function() {

    },

    launch: function () {

        Ext.Loader.setConfig({enabled: true});

        // Static parameters
        cardioCatalogQT.config = {

            mode: 'test', // switch to control use of staging or production server
            //protocol: 'https://',
            protocol: 'http://',
            //apiLogin: '/token',
            apiLogin: '/api/token',
            apiFactor: '/api/factor',
            //apiGetQ: '/get_query/',
            apiGetQ: '/api/get_query/',
            host: '127.0.0.1:5000',
            apiGetQ: '/submit_query/',
            apiWriteQ: '/remote_query_put',
            apiReadQ: '/remote_query_get',
            remove: 'none'
        };

        // TODO - Launch the application

        Ext.onReady(function () {


        });
    }


});
