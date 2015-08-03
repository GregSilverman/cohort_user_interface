/**
 * The main application class. An instance of this class is created by app.js when it calls
 * Ext.application(). This is the ideal place to handle application launch and initialization
 * details.
 */

// See https://github.com/yogeshpandey009/Ext.ux.Exporter/
Ext.Loader.setConfig({
    enabled: true,
    paths: {
        'Ext.ux.exporter': 'exporter'
    }
});

Ext.define('cardioCatalogQT.Application', {
    extend: 'Ext.app.Application',
    
    name: 'cardioCatalogQT',

    stores: [
        'Diagnoses',
        'DemographicsPayload',
        'Labs',
        'Medications',
        'Procedures',
        'Payload',
        'Queries',
        'Results',
        'Atoms',
        'VitalsPayload',
        'LabsPayload',
        'DiagnosesPayload',
        'MedicationsPayload',
        'ProceduresPayload'
    ],
    requires: [
        'Ext.app.*',
        'Ext.ux.exporter.Exporter',
        'Ext.state.CookieProvider',
        'Ext.window.MessageBox',
        'Ext.tip.QuickTipManager',
        'Ext.form.Panel',
        'Ext.ux.form.MultiSelect',
        'Ext.ux.form.ItemSelector',
        'cardioCatalogQT.*'
    ],

    init: function() {

    },

    launch: function () {

        Ext.Loader.setConfig({enabled: true});

        // Static parameters
        cardioCatalogQT.config = {

            mode: 'test', // switch to control use of staging or production server
            protocol: 'http://',
            host: 'rsp-lr-cvapp1.ahc.umn.edu',
            //host: '127.0.0.1:5000',
            //apiLogin: '/token',
            apiLogin: '/api/token',
            apiFactor: '/api/factor',
            //apiGetQ: '/get_query/',
            apiGetQ: '/api/get_query/',
            remove: 'none'
        };

        // TODO - Launch the application

        Ext.onReady(function () {



        });
    }


});
