#!/bin/bash
set -e

echo "ODFE Odoo Addon Installation"
echo "============================"

ODOO_DB=${1:-odfe}
ODOO_USER=${2:-odfe}
ODOO_PASSWORD=${3:-odfe}

echo "Installing ODFE addons..."
for addon in odfe_base odfe_auth odfe_product odfe_floor odfe_pos odfe_customer odfe_payment odfe_booking odfe_coupon odfe_kds odfe_dashboard odfe_realtime odfe_reports odfe_self_order odfe_customer_display; do
    echo "  Installing $addon..."
    odoo -d $ODOO_DB -i $addon --stop-after-init
done

echo "All addons installed successfully!"
