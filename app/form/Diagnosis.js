/**
 * Widget to render to Main view
 */

Ext.define('cardioCatalogQT.form.Diagnosis', {
    extend: 'Ext.form.Panel',
    alias : 'widget.diagnosisForm',
    config: {
        variableHeights: false,
        title: 'Diagnoses',
        xtype: 'form',
        width: 200,
        bodyPadding: 10,
        defaults: {
            anchor: '25%',
            labelWidth: 100
        },
        items: [{ //Dx
            width: 100,
            xtype: 'multiselector',
            title: 'Selected Dx',
            itemId: 'diagnosis',
            fieldName: 'description',
            valueField: 'code',
            viewConfig: {
                deferEmptyText: false,
                emptyText: 'No Dx selected'
            },
            // TODO: fix ability to remove selected items when box is unchecked
            search: {
                field: 'description',
                store: 'Diagnoses',

                search: function (text) {
                    cardioCatalogQT.service.UtilityService.multi_select_search(text, this);
                }
            }
        }],
        lbar: [{
            xtype: 'button',
            itemId: 'button',
            html: 'Toolbar here',
            text: 'Save criteria',
            handler: 'onSubmitDiagnoses'
        }]
    }

});
