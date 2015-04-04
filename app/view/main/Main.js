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
        tbar: [{
            text: 'SelectCriteria',

            handler: function() {
                var panel = Ext.getCmp('Ajax'),
                    payload = Ext.create('cardioCatalogQT.store.Payload');

                if (panel){ // destroy element if it exists
                    panel.setHtml('');
                }

                // initialize data store
                cardioCatalogQT.service.UtilityService.clear_all();

                Ext.widget('form', {
                    xtype: 'multi-selector',
                    width: 400,
                    height: 600,
                    requires: [
                        'Ext.view.MultiSelector'
                    ],
                    renderTo: Ext.getBody(),
                    items: [{ //Dx
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
                    },{ // Px
                        xtype: 'multiselector',
                        title: 'Selected Px',

                        id: 'procedure',
                        name:'procedure',
                        fieldName: 'description',
                        valueField:'code',

                        viewConfig: {
                            deferEmptyText: false,
                            emptyText: 'No Px selected'
                        },
                        // TODO: fix ability to remove selected items when box is unchecked
                        search: {
                            field: 'description',
                            store: 'Procedures',

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
                    },{ // Rx
                        xtype: 'multiselector',
                        title: 'Selected Rx',

                        id: 'medication',
                        name:'medication',
                        fieldName: 'description',
                        valueField:'code',

                        viewConfig: {
                            deferEmptyText: false,
                            emptyText: 'No Rx selected'
                        },
                        // TODO: fix ability to remove selected items when box is unchecked
                        search: {
                            field: 'description',
                            store: 'Medications',

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
                        xtype: 'tbspacer',
                        height: 25
                    },{ // Lab
                        id: 'lab',
                        name:'lab',

                        items: [{
                                xtype: 'combo',
                                width: 400,
                                name: 'LabCode',
                                queryMode: 'local',
                                editable: false,
                                triggerAction: 'all',
                                forceSelection: true,
                                loading: true,
                                fieldLabel: 'Select lab type of',
                                displayField: 'description',
                                valueField: 'code',
                                value: '13457-7',
                                store: 'Labs'
                            },
                            {
                                xtype: 'combo',
                                name: 'LabComparator',
                                queryMode: 'local',
                                editable: false,
                                value: 'eq',
                                triggerAction: 'all',
                                forceSelection: true,
                                fieldLabel: 'That is',
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
                            },
                            {
                                xtype: 'numberfield',
                                name: 'labValue',
                                fieldLabel: 'Value of',
                                value: ''
                            }
                        ]

                    },{
                        xtype: 'tbspacer',
                        height: 25
                    },{ // Systolic
                        id: 'systolic',
                        name:'systolic',

                        items: [{
                            xtype: 'combo',
                            name: 'SystolicComparator',
                            queryMode: 'local',
                            editable: false,
                            value: 'eq',
                            triggerAction: 'all',
                            forceSelection: true,
                            fieldLabel: 'Select systolic bp that is:',
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
                        },{
                            xtype: 'numberfield',
                            name: 'vitalValue',
                            fieldLabel: 'Value of:',
                            value: ''
                        }]
                    },{
                        xtype: 'tbspacer',
                        height: 25
                    },{ //Sex
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
                            fieldLabel: 'Select Sex',
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
                    }]
                }).center();
            }},{

                xtype: 'button',
                itemId: 'button',
                html: 'Toolbar here',

                text: 'Submit criteria',

                // get write elements for query to Proxy store
                handler: function() {
                    var payload = Ext.getStore('Payload');

                    // begin test sex:

                    var submitted = Ext.getCmp('sex');

                    if (cardioCatalogQT.config.mode === 'test') {
                        console.log('show object sex: ');
                        console.log(submitted.items)
                    }

                    var sx = [];
                    Ext.Array.each(submitted,function (item) {
                        sx.push(item.items.items[0].lastValue)

                        // insert only if exists
                        if (item.items.items[0].lastValue) {
                            payload.add({
                                type: 'sex',
                                key: 'sex',
                                comparator: 'eq',
                                value: item.items.items[0].lastValue
                            })
                        }
                    }); // each()

                    if (cardioCatalogQT.config.mode === 'test') {
                        console.log(sx);
                    }

                    payload.sync();

                    //end test sex

                    // begin test systolic

                    var submitted = Ext.getCmp('systolic');

                    if (cardioCatalogQT.config.mode === 'test') {
                        console.log('show object systolic');
                        console.log(submitted.items);
                    }

                    var systolic = [];
                    Ext.Array.each(submitted,function (item) {
                        systolic.push(item.items.items[0].lastValue); // systolic
                        systolic.push(item.items.items[1].lastValue); // comparator

                        // insert only if exists
                        if (item.items.items[1].lastValue) {

                            payload.add({
                                type: 'blood_pressure_systolic',
                                key: 'blood_pressure_systolic',
                                comparator: item.items.items[0].lastValue,
                                value: item.items.items[1].lastValue
                            })
                        }
                    }); // each()

                    if (cardioCatalogQT.config.mode === 'test') {
                        console.log(systolic);
                    }

                    payload.sync();

                    // end test systolic

                    // begin test lab

                    var submitted = Ext.getCmp('lab');

                    if (cardioCatalogQT.config.mode === 'test') {
                        console.log('show object labs');
                        console.log(submitted.items)
                    }

                    var lab = [];
                        Ext.Array.each(submitted, function (item) {
                            lab.push(item.items.items[0].lastValue); // type
                            lab.push(item.items.items[1].lastValue); // comparator


                            // only insert if exists
                            if (item.items.items[2].lastValue) {
                                payload.add({
                                    type: 'lab',
                                    key: item.items.items[0].lastValue,
                                    value: item.items.items[2].lastValue,
                                    comparator: item.items.items[1].lastValue
                                })
                            }
                        }); // each()

                        if (cardioCatalogQT.config.mode === 'test') {
                            console.log('labs:');
                            console.log(lab);
                        }

                        payload.sync();

                    // end test lab

                    // begin test Rx

                    var submitted = Ext.getCmp('medication'),
                        rx = [];

                    if (cardioCatalogQT.config.mode === 'test') {
                        console.log('show submitted Rx: ');
                        console.log(submitted);
                    }

                    Ext.Array.each(submitted.store.data.items, function (item) {
                        rx.push(item.data.code,item.data.description);

                        if (cardioCatalogQT.config.mode === 'test') {
                            console.log(item)
                        }

                        // TODO: ensure record does not already exist

                        payload.add({
                            type: 'rx',
                            key: 'rx_code',
                            comparator: 'eq',
                            value: item.data.code,
                            description: item.data.description
                        });

                        payload.sync();

                        if (cardioCatalogQT.config.mode === 'test') {
                            console.log('rx');
                            console.log(rx);
                            console.log(payload);
                        }

                    }); // each()

                    // end test Rx

                    // begin test Px

                    var submitted = Ext.getCmp('procedure'),
                        px = [];

                    if (cardioCatalogQT.config.mode === 'test') {
                        console.log('show submitted Px:');
                        console.log(submitted);
                    }

                    Ext.Array.each(submitted.store.data.items, function (item) {
                        px.push(item.data.code,item.data.description);

                        if (cardioCatalogQT.config.mode === 'test') {
                            console.log(item)
                        }

                        // write selected to store
                        // TODO: ensure record does not already exist

                        payload.add({
                            type: 'px',
                            key: 'proc_code',
                            comparator: 'eq',
                            value: item.data.code,
                            description: item.data.description
                        });

                        payload.sync();

                        if (cardioCatalogQT.config.mode === 'test') {
                            console.log('px');
                            console.log(px);
                            console.log(payload);
                        }

                    }); // each()

                    // end test Px

                    // begin test Dx

                    var submitted = Ext.getCmp('diagnosis'),
                        dx = [];

                    if (cardioCatalogQT.config.mode === 'test') {
                        console.log('show submitted Dx:');
                        console.log(submitted);
                    }

                    Ext.Array.each(submitted.store.data.items, function (item) {
                        dx.push(item.data.code,item.data.description);

                        if (cardioCatalogQT.config.mode === 'test') {
                            console.log(item)
                        }

                        // TODO: ensure record does not already exist
                        payload.add({
                            type: 'dx',
                            key: 'dx_code',
                            comparator: 'eq',
                            value: item.data.code,
                            description: item.data.description
                        });

                        payload.sync();

                        if (cardioCatalogQT.config.mode === 'test') {
                            console.log('dx');
                            console.log(dx);
                            console.log(payload);
                        }

                    }); // each()
                    // end test Dx

                    if (cardioCatalogQT.config.mode === 'test') {
                        console.log('payload for URL creation');
                        console.log(payload);
                    }

                    var url = cardioCatalogQT.service.UtilityService.url(payload);

                    if (cardioCatalogQT.config.mode === 'test') {
                        console.log('call to make url: ' + url);
                    }

                }

            },{
            text: 'SubmitQuery',
            handler: function() {

                var element,
                    auth = sessionStorage.sessionToken + ':unknown',
                    hash = 'Basic ' + cardioCatalogQT.service.Base64.encode(auth);

                // clear form elements
                element = Ext.getCmp('diagnosis');
                if (element){  // destroy element if it exists
                    element.destroy();
                }
                element = Ext.getCmp('lab');
                if (element){  // destroy element if it exists
                    element.destroy();
                }
                element = Ext.getCmp('medication');
                if (element){  // destroy element if it exists
                    element.destroy();
                }
                element = Ext.getCmp('procedure');
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
                    url = cardioCatalogQT.service.UtilityService.url_request(),
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

                    //payload  += 'vital:BLOOD_PRESSURE;eq;BLOOD_PRESSURE;vital:BLOOD_PRESSURE_SYSTOLIC;ge;160';

                panel.setMasked({
                    xtype: 'loadmask',
                    message: 'Loading...'
                });

                // send auth header before Ajax request to disable auth form
                Ext.Ajax.on('beforerequest', (function(klass, request) {
                    return request.headers.Authorization = hash;
                }), this);

                Ext.Ajax.request({
                    cors: true,
                    url: url,
                    useDefaultXhrHeader: false,
                    headers: {
                        'Accept': 'application/json'
                    },
                    disableCaching: false,
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
            }}
        ]
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

