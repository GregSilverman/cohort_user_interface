/**
 * The main application class. An instance of this class is created by app.js when it calls
 * Ext.application(). This is the ideal place to handle application launch and initialization
 * details.
 */

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
        'Ext.overrides.selection.CheckboxModel'
    ],

    stores: [
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
            //host: 'cc.cardio.umn.edu',
            //host: 'vein.ahc.umn.edu',
            host: '127.0.0.1:5000',
            apiGetQ: '/get_query/',
            //apiGetQ: '/api/get_query/',
            apiWriteQ: '/remote_query_put',
            apiReadQ: '/remote_query_get',
            //apiMedsMenu: '/api/meds',
            //apiMedsMenu: '/meds',
            remove: 'none'
        };

        // TODO - Launch the application

        Ext.onReady(function () {


        });
    }


});
