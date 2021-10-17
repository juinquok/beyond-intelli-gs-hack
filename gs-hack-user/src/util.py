def update_user(cognito_id, key, value, table):
    response = table.update_item(
        Key={
            'cognitoID': cognito_id
        },
        UpdateExpression=f"set {key}=:v",
        ExpressionAttributeValues={
            ':v': value
        },
        ReturnValues="UPDATED_NEW"
    )
    return response

