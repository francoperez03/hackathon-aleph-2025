#!/bin/bash

# Configurable variables
INSTANCE_NAME="vpn-server-3"
REGION="us-east-1"
#REGION="eu-central-1"
AVAILABILITY_ZONE="us-east-1a"
# AVAILABILITY_ZONE="eu-central-1a"
BUNDLE_ID="nano_3_0"
BLUEPRINT_ID="ubuntu_24_04"

echo "Creating Lightsail instance: $INSTANCE_NAME"

aws lightsail create-instances \
  --instance-names "$INSTANCE_NAME" \
  --availability-zone "$AVAILABILITY_ZONE" \
  --blueprint-id "$BLUEPRINT_ID" \
  --bundle-id "$BUNDLE_ID" \
  --region "$REGION"

# Wait manually for the instance to be running
echo "Waiting for instance to enter 'running' state..."
while true; do
  STATE=$(aws lightsail get-instance --instance-name "$INSTANCE_NAME" --region "$REGION" \
    --query 'instance.state.name' --output text)

  echo "Current state: $STATE"

  if [[ "$STATE" == "running" ]]; then
    break
  fi

  sleep 5
done

echo "Instance $INSTANCE_NAME is running."

# Get public IP
IP=$(aws lightsail get-instance --instance-name "$INSTANCE_NAME" --region "$REGION" \
  --query 'instance.publicIpAddress' --output text)

echo "Instance public IP: $IP"
