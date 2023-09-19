<?php
namespace Bookly\Lib\Payment\Proxy;

use Bookly\Lib as BooklyLib;

/**
 * @method static BooklyLib\Entities\Payment completeGiftCard( BooklyLib\Entities\Payment $payment, BooklyLib\Entities\Customer $customer ) Set payment completed
 */
abstract class Pro extends BooklyLib\Base\Proxy
{

}