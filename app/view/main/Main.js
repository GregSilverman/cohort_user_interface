/**
 * This class is the main view for the application. It is specified in app.js as the
 * "autoCreateViewport" property. That setting automatically applies the "viewport"
 * plugin to promote that instance of this class to the body element.
 *
 * TODO - Replace this content of this view to suite the needs of your application.
 */
Ext.define('cardioCatalogQT.view.main.Main', {
    extend: 'Ext.container.Container',
    requires: [
        'cardioCatalogQT.view.main.MainController',
        'cardioCatalogQT.view.main.MainModel',
        'Ext.ux.form.ItemSelector',
        'Ext.tip.QuickTipManager',
        'Ext.ux.ajax.JsonSimlet',
        'Ext.ux.ajax.SimManager'
    ],

    xtype: 'app-main',

    controller: 'main',
    viewModel: {
        type: 'main'
    },

    layout: {
        type: 'border'
    },

    items: [{
        xtype: 'panel',
        id: 'Test',
        styleHtmlContent: true,

        bind: {
            title: '{name}'
        },
        region: 'west',
        html: '<ul><li>Add tree menu here.</li></ul>',
        width: 250,
        split: true,
        tbar: [{ // Dx
            text: 'Select criteria',
            handler: function() {
                var panel = Ext.getCmp('Ajax'),
                    payload = Ext.create('cardioCatalogQT.store.Payload');
                if (panel){ // destroy element if it exists
                    panel.setHtml('');
                }

                Ext.widget('form', {
                    xtype: 'multi-selector',
                    width: 300,
                    height: 400,
                    requires: [
                        'Ext.view.MultiSelector'
                    ],
                    renderTo: Ext.getBody(),
                    padding: -5,
                    items: [{
                        anchor: '50%',
                        bbar: [{
                            xtype: 'button',
                            itemId: 'button',
                            html: 'Toolbar here',

                            text: 'Submit to API',

                            // get submitted array
                            handler: function() {


                                var submitted = Ext.getCmp('diagnosis'),
                                    dx = [];

                                if (cardioCatalogQT.config.mode === 'test') {
                                    console.log('In submitted values handler: ');
                                    console.log(submitted);
                                }

                                Ext.Array.each(submitted.store.data.items, function (item) {
                                    dx.push(item.data.code,item.data.description);

                                    console.log(item)
                                    // write selected to store
                                    // TODO: ensure record does not already exist

                                    payload.add({
                                        type: 'dx',
                                        key: 'dx_code',
                                        comparator: 'eq',
                                        value: item.data.code
                                    });

                                    payload.sync();

                                    if (cardioCatalogQT.config.mode === 'test') {
                                        console.log(payload);
                                    }

                                }); // each()

                                Ext.Msg.alert('Submitted Values',
                                    'The following diagnoses will be sent to the server:  <br />' + dx);

                                if (cardioCatalogQT.config.mode === 'test') {
                                    console.log(dx);
                                }
                            }
                        }],
                        xtype: 'multiselector',
                        title: 'Selected Dx',

                        id: 'diagnosis',
                        name:'diagnosis',
                        fieldName: 'description',
                        valueField:'code',

                        viewConfig: {
                            deferEmptyText: false,
                            emptyText: 'No Dx selected'
                        },
                        // TODO: fix ability to remove selected items when box is unchecked
                        search: {
                            field: 'description',
                            store: 'Diagnoses',

                            search: function (text) {
                                var me = this,
                                    filter = me.searchFilter,
                                    filters = me.getSearchStore().getFilters();

                                if (text) {
                                    filters.beginUpdate();

                                    if (filter) {
                                        filter.setValue(text);
                                    } else {
                                        me.searchFilter = filter = new Ext.util.Filter({
                                            id: 'search',
                                            property: me.field,
                                            value: text,

                                            // only change from http://docs.sencha.com/extjs/5.1/5.1.0-apidocs/source/MultiSelectorSearch.html#Ext-view-MultiSelectorSearch-method-search
                                            anyMatch: true
                                        });
                                    }

                                    filters.add(filter);

                                    filters.endUpdate();
                                } else if (filter) {
                                    filters.remove(filter);
                                }
                            }
                        }
                    },{
                        bbar: [{ //Labs
                            xtype: 'button',
                            itemId: 'button',
                            html: 'Toolbar here',

                            text: 'Submit request to API',

                            // get submitted array
                            handler: function(btn) {
                                if (cardioCatalogQT.config.mode === 'test') {
                                    console.log('In submitted values handler: ');
                                }

                                //var submitted = btn.up('form');

                                var submitted = Ext.getCmp('labs');

                                if (cardioCatalogQT.config.mode === 'test') {
                                    console.log('show object');
                                    console.log(submitted.items)
                                }

                                //values = submitted.getValues();
                                var systolic = [];
                                Ext.Array.each(submitted,function (item) {
                                    systolic.push(item.items.items[0].lastValue); // systolic
                                    systolic.push(item.items.items[1].lastValue); // comparator

                                    payload.add({
                                        type: 'lab',
                                        key:item.items.items[1].lastValue,
                                        comparator: item.items.items[2].lastValue,
                                        value: item.items.items[0].lastValue
                                    })
                                }); // each()

                                Ext.Msg.alert('Submitted Values',
                                    'The following Vitals will be sent to the server:  <br />' + systolic);

                                if (cardioCatalogQT.config.mode === 'test') {
                                    console.log(systolic);
                                }

                                payload.sync();
                            }
                        }],

                        id: 'labs',
                        name:'labs',

                        items: [{
                            xtype: 'numberfield',
                            name: 'vitalValue',
                            fieldLabel: 'Value',
                            value: ''
                        },
                        {
                            xtype: 'combo',
                            name: 'SystolicComparator',
                            queryMode: 'local',
                            editable: false,
                            triggerAction: 'all',
                            forceSelection: true,
                            fieldLabel: 'Lab',
                            displayField: 'description',
                            valueField: 'code',
                            store: 'Diagnoses' // use for testing
                        },
                        {
                            xtype: 'combo',
                            name: 'SystolicComparator',
                            queryMode: 'local',
                            editable: false,
                            value: 'eq',
                            triggerAction: 'all',
                            forceSelection: true,
                            fieldLabel: 'Comparator',
                            displayField: 'name',
                            valueField: 'value',
                            store: {
                                 fields: ['name', 'value'],
                                 data: [
                                     {name : '=', value: 'eq'},
                                     {name : '<', value: 'lt'},
                                     {name : '<=', value: 'le'},
                                     {name : '>', value: 'gt'},
                                     {name : '>=', value: 'ge'}
                                ]
                            }
                        }]


                    },{
                        bbar: [{ //Systolic
                            xtype: 'button',
                            itemId: 'button',
                            html: 'Toolbar here',

                            text: 'Submit request to API',

                            // get submitted array
                            handler: function(btn) {
                                if (cardioCatalogQT.config.mode === 'test') {
                                    console.log('In submitted values handler: ');
                                }

                                //var submitted = btn.up('form');

                                var submitted = Ext.getCmp('systolic');

                                if (cardioCatalogQT.config.mode === 'test') {
                                    console.log('show object');
                                    console.log(submitted.items)
                                }

                                //values = submitted.getValues();
                                var systolic = [];
                                Ext.Array.each(submitted,function (item) {
                                    systolic.push(item.items.items[0].lastValue); // systolic
                                    systolic.push(item.items.items[1].lastValue); // comparator

                                    payload.add({
                                        type: 'blood_pressure_systolic',
                                        key: 'blood_pressure_systolic' ,
                                        comparator: item.items.items[1].lastValue,
                                        value: item.items.items[0].lastValue
                                    })
                                }); // each()

                                Ext.Msg.alert('Submitted Values',
                                    'The following Vitals will be sent to the server:  <br />' + systolic);

                                if (cardioCatalogQT.config.mode === 'test') {
                                    console.log(systolic);
                                }

                                payload.sync();
                            }
                        }],

                        id: 'systolic',
                        name:'systolic',

                        items: [{
                            xtype: 'numberfield',
                            name: 'vitalValue',
                            fieldLabel: 'Systolic',
                            value: ''
                        },
                        {
                            xtype: 'combo',
                            name: 'SystolicComparator',
                            queryMode: 'local',
                            editable: false,
                            value: 'eq',
                            triggerAction: 'all',
                            forceSelection: true,
                            fieldLabel: 'Comparator',
                            displayField: 'name',
                            valueField: 'value',
                            store: {
                                fields: ['name', 'value'],
                                data: [
                                    {name : '=', value: 'eq'},
                                    {name : '<', value: 'lt'},
                                    {name : '<=', value: 'le'},
                                    {name : '>', value: 'gt'},
                                    {name : '>=', value: 'ge'}
                                ]
                            }
                        }]
                    },{

                        bbar: [{
                            xtype: 'button',
                            itemId: 'button',
                            html: 'Toolbar here',

                            text: 'Submit request to API',
                           // margin: '40 30 20 10',

                            // get submitted array
                            handler: function(btn) {
                                if (cardioCatalogQT.config.mode === 'test') {
                                    console.log('In submitted values handler: ');
                                }

                                var submitted = Ext.getCmp('sex');

                                //var submitted = form.findField('vitalComparator').getSubmitValue();

                                if (cardioCatalogQT.config.mode === 'test') {
                                    console.log('show object');
                                    console.log(submitted.items)
                                }


                                //values = submitted.getValues();

                                var sx = [];
                                Ext.Array.each(submitted,function (item) {
                                    sx.push(item.items.items[0].lastValue)

                                    payload.add({
                                        type: 'sex',
                                        key: 'sex' ,
                                        comparator:'eq' ,
                                        value: item.items.items[0].lastValue
                                    })
                                }); // each()

                                Ext.Msg.alert('Submitted Values',
                                    'The following Sex will be sent to the server:  <br />' + sx);

                                if (cardioCatalogQT.config.mode === 'test') {
                                    console.log(sx);
                                }

                                payload.sync();
                            }
                        }],

                        id: 'sex',
                        name:'sex',

                        items: [{
                            xtype: 'combo',
                            name: 'vitalComparator',
                            queryMode: 'local',
                            editable: false,
                            value: 'eq',
                            triggerAction: 'all',
                            forceSelection: true,
                            fieldLabel: 'Sex',
                            displayField: 'name',
                            valueField: 'value',
                            store: {
                                fields: ['name', 'value'],
                                data: [
                                    {name : 'female', value: 'f'},
                                    {name : 'male', value: 'm'}
                                ]
                            }
                        }]
                    },{xtype: 'tbspacer', height: 500}]
                }).center();
            }},{
            text: 'SubmitQuery',
            handler: function() {

                var element;

                // clear form elements
                element = Ext.getCmp('diagnosis');
                if (element){  // destroy element if it exists
                    element.destroy();
                }
                element = Ext.getCmp('lab');
                if (element){  // destroy element if it exists
                    element.destroy();
                }
                element = Ext.getCmp('systolic');
                if (element){  // destroy element if it exists
                    element.destroy();
                }
                element = Ext.getCmp('sex');
                if (element){  // destroy element if it exists
                    element.destroy();
                }
                var panel = Ext.getCmp('Ajax'),
                    url = 'http://127.0.0.1:5000/api/getQ/',
                    payload = 'lab:TEST_CODE;eq;13457-7;lab:RESULT_VALUE_NUM;ge;160;',
                    json = [],
                    records = [],
                    store = Ext.create('Ext.data.Store',{
                        fields: [
                            'attribute',
                            'sid',
                            'value',
                            'N',
                            'source'
                        ],
                        data: records,
                        paging: false
                    });

                    payload  += 'vital:BLOOD_PRESSURE;eq;BLOOD_PRESSURE;vital:BLOOD_PRESSURE_SYSTOLIC;ge;160';

                panel.setMasked({
                    xtype: 'loadmask',
                    message: 'Loading...'
                });

                url += payload; // append payload to URL

                Ext.Ajax.request({
                    url: url,
                    success: function(response) {
                        json = Ext.decode(response.responseText);
                        if (cardioCatalogQT.config.mode === 'test') {
                            console.log('json' + json);
                        }

                        if(json !== null &&  typeof (json) !==  'undefined'){

                            Ext.each(json, function(entry) {
                                Ext.each(json.items || [], function(tuple) {

                                    records.push({
                                        N: tuple[0].N,
                                        sid: tuple[0].sid,
                                        source: tuple[0].source
                                    });
                                    if (cardioCatalogQT.config.mode === 'test') {
                                        console.log(tuple[0].source
                                        + 'N ' + tuple[0].N
                                        + 'attribute ' + tuple[0].attribute
                                        + 'sid ' + tuple[0].sid
                                        + 'value ' + tuple[0].value);
                                    }
                                });
                            });
                            if (cardioCatalogQT.config.mode === 'test') {
                                console.log(records);
                            }

                            //update store with data
                            store.add(records);
                        }



                        // render template
                        cardioCatalogQT.service.UtilityService.template(panel, store);
                    }
                });
            }},
            {

                text: 'CreateURL',
                handler: function() {
                    var payload = Ext.getStore('Payload');

                    if (cardioCatalogQT.config.mode === 'test') {
                        console.log('payload');
                        console.log(payload);
                    }

                    var url = cardioCatalogQT.service.UtilityService.url(payload);
                    // parse diagnoses

                    if (cardioCatalogQT.config.mode === 'test') {
                        console.log('call to make url: ' + url);
                    }

                }

            }]
    },{
        region: 'center',
        xtype: 'panel',
        id: 'Ajax',
        styleHtmlContent: true,
        items:[{
            xtype: 'image',
            src: 'resources/images/cv.png',
            height: 80,
            width: 280
        },{
            title: 'UI Sandbox',
            html: '<h2>Ajax test.</h2>'
        }]
    }]
});

