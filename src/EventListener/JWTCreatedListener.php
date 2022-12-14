<?php
namespace App\EventListener;

use Lexik\Bundle\JWTAuthenticationBundle\Event\JWTCreatedEvent;

class JWTCreatedListener
{
    /**
     * Adds additional data to the generated JWT
     *
     * @param JWTCreatedEvent $event
     *
     * @return void
     */
    public function onJWTCreated(JWTCreatedEvent $event)
    {
        /** @var $user \AppBundle\Entity\User */
        $user = $event->getUser();

        // merge with existing event data
        $payload = array_merge(
            $event->getData(),
            [
                'firstname' => $user->getFirstname(),
                'hasCreatedPwd' => $user->isHasCreatedPwd()
            ]
        );

        $event->setData($payload);
    }
}